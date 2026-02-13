import { RentalPeriod, Property } from "@/types/property";

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
 * Filter out properties that are currently rented
 * This prevents showing properties to users during active rental periods
 */
export function filterAvailableProperties<T extends Pick<Property, 'current_rental_end' | 'rental_periods'>>(
  properties: T[]
): T[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return properties.filter(property => {
    // Check if property has an active rental period using current_rental_end
    if (property.current_rental_end) {
      const rentalEndDate = new Date(property.current_rental_end);
      rentalEndDate.setHours(0, 0, 0, 0);
      
      // If rental end date is today or in the future, property is currently rented
      if (rentalEndDate >= today) {
        return false;
      }
    }

    // Double-check against rental_periods array for active/confirmed bookings
    if (property.rental_periods && property.rental_periods.length > 0) {
      const hasActiveRental = property.rental_periods.some(period => {
        if (period.status !== 'active' && period.status !== 'confirmed') {
          return false;
        }

        const startDate = new Date(period.start_date);
        const endDate = new Date(period.end_date);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        // Check if today falls within the rental period
        return today >= startDate && today <= endDate;
      });

      if (hasActiveRental) {
        return false;
      }
    }

    // Property is available
    return true;
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
