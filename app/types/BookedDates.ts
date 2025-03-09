import { Timestamp } from "firebase/firestore";

export interface BookingDate {
    bookingId: string;
    bookedDates?: Timestamp[];
    viewingDate?: Timestamp
}