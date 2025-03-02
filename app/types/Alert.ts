import { Timestamp } from "firebase/firestore";
import { UserData } from "./UserData";

export interface Alert {
    id?: string;
    message: string;
    type: 'booking' | 'inquiry';
    bookingType?: "apartment" | "transient";
    bookingId?: string;
    conversationId?: string;
    createdAt?: Timestamp;
    propertyId: string;
    isRead: boolean;
    sender: UserData;
    receiver?: UserData;
}