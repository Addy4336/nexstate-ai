import { RentalPeriod, Property, CurrentTenant } from "@/types/property";
import { supabaseAdmin } from "@/lib/db";

/**
 * Check if a property is currently rented
 */
export function isCurrentlyRented(
  currentRentalEnd: string | null
): boolean {
  if (!currentRentalEnd) return false;
  const endDate = new Date(currentRentalEnd);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return endDate >= today;
}

/**
 * Enrich properties with current tenant information if they are rented
 * This adds is_currently_rented and current_tenant fields to each property
 */
export async function enrichPropertiesWithTenantInfo<T extends Property>(
  properties: T[]
): Promise<T[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get all property IDs that might be rented
  const rentedPropertyIds = properties
    .filter(p => p.current_rental_end)
    .map(p => p.id);

  if (rentedPropertyIds.length === 0) {
    // No rented properties, just mark all as available
    return properties.map(p => ({
      ...p,
      is_currently_rented: false,
      current_tenant: null,
    }));
  }

  // Fetch active payments for these properties
  const { data: payments } = await supabaseAdmin
    .from("payments")
    .select("property_id, user_name, user_email, user_phone, check_in_date, check_out_date, guests, amount")
    .in("property_id", rentedPropertyIds)
    .eq("status", "success")
    .gte("check_out_date", today.toISOString().split('T')[0])
    .order("created_at", { ascending: false });

  // Create a map of property_id to tenant info
  const tenantInfoMap = new Map<string, CurrentTenant>();
  
  if (payments) {
    for (const payment of payments) {
      if (!tenantInfoMap.has(payment.property_id)) {
        // Only store the most recent payment (already ordered by created_at desc)
        const checkOutDate = new Date(payment.check_out_date);
        checkOutDate.setHours(0, 0, 0, 0);
        
        // Only include if rental is currently active
        if (checkOutDate >= today) {
          tenantInfoMap.set(payment.property_id, {
            name: payment.user_name,
            email: payment.user_email,
            phone: payment.user_phone,
            check_in_date: payment.check_in_date,
            check_out_date: payment.check_out_date,
            guests: payment.guests,
            amount_paid: Number(payment.amount),
          });
        }
      }
    }
  }

  // Enrich properties with tenant information
  return properties.map(property => {
    const isRented = isCurrentlyRented(property.current_rental_end);
    const tenantInfo = tenantInfoMap.get(property.id);

    return {
      ...property,
      is_currently_rented: isRented && !!tenantInfo,
      current_tenant: isRented && tenantInfo ? tenantInfo : null,
    };
  });
}

/**
 * Get the next available date for a property
 * Considers both current rental and future bookings to find earliest availability
 */
export function getNextAvailableDate(
  currentRentalEnd: string | null,
  rentalPeriods: RentalPeriod[] = []
): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If no rental periods, available from today
  if (!rentalPeriods || rentalPeriods.length === 0) {
    return today;
  }

  // Get all active/confirmed bookings sorted by start date
  const allBookings = rentalPeriods
    .filter(p => (p.status === 'active' || p.status === 'confirmed'))
    .map(p => ({
      start: new Date(p.start_date),
      end: new Date(p.end_date)
    }))
    .sort((a, b) => a.start.getTime() - b.start.getTime());

  if (allBookings.length === 0) {
    return today;
  }

  // Check if today is before all bookings
  const firstBooking = allBookings[0];
  if (today < firstBooking.start) {
    return today;
  }

  // Find the first booking that ends today or in the future
  for (let i = 0; i < allBookings.length; i++) {
    const currentBooking = allBookings[i];
    
    // If this booking ends today or in the future
    if (currentBooking.end >= today) {
      // Check if there's a gap before the next booking
      if (i < allBookings.length - 1) {
        const nextBooking = allBookings[i + 1];
        const dayAfterCurrent = new Date(currentBooking.end);
        dayAfterCurrent.setDate(dayAfterCurrent.getDate() + 1);
        
        const dayBeforeNext = new Date(nextBooking.start);
        dayBeforeNext.setDate(dayBeforeNext.getDate() - 1);
        
        // If there's a gap of at least 1 day
        if (dayAfterCurrent <= dayBeforeNext) {
          return dayAfterCurrent;
        }
      } else {
        // This is the last booking, return day after it ends
        const dayAfterLast = new Date(currentBooking.end);
        dayAfterLast.setDate(dayAfterLast.getDate() + 1);
        return dayAfterLast;
      }
    }
  }

  // Fallback to day after last booking
  const lastBooking = allBookings[allBookings.length - 1];
  const availableDate = new Date(lastBooking.end);
  availableDate.setDate(availableDate.getDate() + 1);
  
  return availableDate;
}

/**
 * Check if requested dates are available
 */
export function areDatesAvailable(
  startDate: string,
  endDate: string,
  currentRentalEnd: string | null,
  rentalPeriods: RentalPeriod[]
): { available: boolean; reason?: string } {
  const requestStart = new Date(startDate);
  const requestEnd = new Date(endDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if start date is in the past
  if (requestStart < today) {
    return { available: false, reason: "Start date cannot be in the past" };
  }

  // Check if end date is before start date
  if (requestEnd < requestStart) {
    return { available: false, reason: "End date must be after start date" };
  }

  // Check against current rental
  if (currentRentalEnd) {
    const currentEnd = new Date(currentRentalEnd);
    const minAvailableDate = new Date(currentEnd);
    minAvailableDate.setDate(minAvailableDate.getDate() + 1);

    if (requestStart < minAvailableDate) {
      return {
        available: false,
        reason: `Property is rented until ${currentRentalEnd}. Available from ${minAvailableDate.toISOString().split('T')[0]}`,
      };
    }
  }

  // Check against future bookings
  const activeRentals = rentalPeriods.filter(
    (period) => period.status === "confirmed" || period.status === "active"
  );

  for (const rental of activeRentals) {
    const rentalStart = new Date(rental.start_date);
    const rentalEnd = new Date(rental.end_date);

    // Check for overlap (no buffer)
    if (requestStart <= rentalEnd && requestEnd >= rentalStart) {
      return {
        available: false,
        reason: `Dates overlap with existing booking (${rental.start_date} to ${rental.end_date})`,
      };
    }
  }

  return { available: true };
}

/**
 * Calculate rental cost based on daily rate
 */
export function calculateRentalCost(
  startDate: string,
  endDate: string,
  monthlyRate: number
): { days: number; total: number; dailyRate: number } {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  const dailyRate = monthlyRate / 30;
  const total = Math.round(dailyRate * days);

  return { days, total, dailyRate };
}

/**
 * Format date for display
 */
export function formatDateDisplay(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get rental status display text
 */
export function getRentalStatusText(
  status: string,
  currentRentalEnd: string | null
): { text: string; color: string } {
  if (status === "rented" && currentRentalEnd) {
    const endDate = new Date(currentRentalEnd);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (endDate >= today) {
      return {
        text: `Rented until ${formatDateDisplay(currentRentalEnd)}`,
        color: "orange",
      };
    }
  }

  const statusMap: Record<string, { text: string; color: string }> = {
    available: { text: "Available Now", color: "green" },
    rented: { text: "Rented", color: "orange" },
    sold: { text: "Sold", color: "red" },
    maintenance: { text: "Under Maintenance", color: "red" },
    archived: { text: "Archived", color: "gray" },
  };

  return statusMap[status] || { text: "Unknown", color: "gray" };
}

/**
 * Validate minimum rental period - REMOVED: No minimum stay required
 */
export function validateMinimumStay(
  startDate: string,
  endDate: string,
  minDays: number = 0
): { valid: boolean; reason?: string } {
  // No minimum stay validation - always return valid
  return { valid: true };
}
