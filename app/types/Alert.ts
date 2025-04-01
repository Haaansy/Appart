import { FieldValue, Timestamp } from "firebase/firestore";
import UserData from "./UserData";

export default interface Alert {
    id?: string;
    message: string;
    type: 'Booking' | 'Inquiry' | 'Review';
    bookingType?: "Apartment" | "Transient";
    bookingId?: string;
    conversationId?: string;
    propertyId: string;
    isRead: boolean;
    senderId: string;
    receiverId?: string;
    createdAt: Timestamp | FieldValue;
    tenantId?: string;
}