import { addDays, isSaturday, isSunday, isFriday, differenceInDays } from "date-fns";

export interface PriceBreakdown {
  hireType: "daily" | "weekend" | "weekly";
  numberOfDays: number;
  hireRate: number;
  hireFeeTotal: number;
}

/**
 * Calculate hire fee for a date range.
 * Weekend rate applies when booking spans Fri–Sun (exactly 3 days starting on Friday).
 * Weekly rate applies for 7+ consecutive days.
 * Otherwise: daily rate per day.
 */
export function calculatePrice(
  startDate: Date,
  endDate: Date,
  dailyRate: number,
  weekendRate: number,
  weeklyRate: number
): PriceBreakdown {
  const numberOfDays = differenceInDays(endDate, startDate) + 1;

  // Weekly: 7+ days
  if (numberOfDays >= 7) {
    const weeks = Math.floor(numberOfDays / 7);
    const remainingDays = numberOfDays % 7;
    const total = weeks * weeklyRate + remainingDays * dailyRate;
    return {
      hireType: "weekly",
      numberOfDays,
      hireRate: weeklyRate,
      hireFeeTotal: total,
    };
  }

  // Weekend: exactly Fri + Sat + Sun
  if (numberOfDays === 3 && isFriday(startDate)) {
    return {
      hireType: "weekend",
      numberOfDays,
      hireRate: weekendRate,
      hireFeeTotal: weekendRate,
    };
  }

  // Daily
  return {
    hireType: "daily",
    numberOfDays,
    hireRate: dailyRate,
    hireFeeTotal: numberOfDays * dailyRate,
  };
}

/**
 * Returns dates that are blocked by the 1-day buffer after each booking end date.
 */
export function getBufferDate(endDate: Date): Date {
  return addDays(endDate, 1);
}
