import { Timestamp } from 'firebase/firestore';
import { Alert } from 'react-native';

/**
 * Checks if a date is in the past
 */
export const isDateInPast = (date: Timestamp): boolean => {
  const currentDate = Timestamp.now();
  return date.toMillis() < currentDate.toMillis();
};

/**
 * Checks if a viewing date is valid (before or on the start date)
 */
export const isViewingDateValid = (viewingDate: Timestamp, startDate: Timestamp | null): boolean => {
  if (!startDate) return true;
  return viewingDate.toMillis() <= startDate.toMillis();
};

/**
 * Formats currency with locale support
 */
export const formatCurrency = (
  price: number,
  locale = "en-PH",
  currency = "PHP"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Checks for booking date conflicts
 */
export const checkDateConflicts = (
  startDate: Date,
  endDate: Date, 
  bookedDates: Timestamp[]
): boolean => {
  let currentCheckDate = new Date(startDate);
  while (currentCheckDate <= endDate) {
    const checkTimestamp = Timestamp.fromDate(new Date(currentCheckDate));
    const isBooked = bookedDates.some(bookedDate => 
      checkTimestamp.toDate().setHours(0,0,0,0) === bookedDate.toDate().setHours(0,0,0,0)
    );
    
    if (isBooked) {
      Alert.alert("Booking Conflict", "Some dates in your selected range are already booked. Please select a different date range.");
      return true;
    }
    
    currentCheckDate.setDate(currentCheckDate.getDate() + 1);
  }
  return false;
};

/**
 * Generates an array of booked dates based on start date and lease duration
 */
export const generateBookedDates = (startDate: Date, leaseDuration: number): Timestamp[] => {
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + leaseDuration);

  const bookedDates: Timestamp[] = [];
  let currentDate = new Date(startDate);

  // Add all dates between startDate and endDate
  while (currentDate <= endDate) {
    bookedDates.push(Timestamp.fromDate(new Date(currentDate)));
    currentDate.setDate(currentDate.getDate() + 1); // Move to next day
  }

  return bookedDates;
};
