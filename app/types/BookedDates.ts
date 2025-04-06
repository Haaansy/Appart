import { Timestamp } from "firebase/firestore";

export default interface BookingDate {
    bookingId: string;
    bookedDates?: Timestamp[];
    viewingDate?: Timestamp
}