import { RentalPeriod } from "@/types/property";

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
 * Get the next available date for a property
 */
export function getNextAvailableDate(
  currentRentalEnd: string | null,
  bufferDays: number = 2
): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!currentRentalEnd) {
    return today;
  }

  const endDate = new Date(currentRentalEnd);
  if (endDate < today) {
    return today;
  }

  // Add buffer days after rental ends
  const availableDate = new Date(endDate);
  availableDate.setDate(availableDate.getDate() + bufferDays + 1);
  return availableDate;
}

/**
 * Check if requested dates are available
 */
export function areDatesAvailable(
  startDate: string,
  endDate: string,
  currentRentalEnd: string | null,
  rentalPeriods: RentalPeriod[],
  bufferDays: number = 2
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
    minAvailableDate.setDate(minAvailableDate.getDate() + bufferDays + 1);

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

    // Add buffer to rental dates
    const bufferStart = new Date(rentalStart);
    bufferStart.setDate(bufferStart.getDate() - bufferDays);
    const bufferEnd = new Date(rentalEnd);
    bufferEnd.setDate(bufferEnd.getDate() + bufferDays);

    // Check for overlap
    if (requestStart <= bufferEnd && requestEnd >= bufferStart) {
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
