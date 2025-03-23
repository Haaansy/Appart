import { FieldValue, Timestamp } from "firebase/firestore";
import Tenant from "./Tenant";

export default interface Booking {
    id?: string;
    type: "Apartment" | "Transient";
    propertyId: string;
    status: "Booked" | "Pending Invitation" | "Viewing Confirmed" | "Booking Confirmed" | "Booking Declined" | "Booking Completed";
    bookedDate: Timestamp[];
    leaseDuration: number;
    tenants: Tenant[];
    tenantIds?: string[];
    viewingDate?: Timestamp;
    owner: string;
    createdAt?: Timestamp | FieldValue;
    conversationId?: string;
    declinedReason?: string;
    review?: {
        rating: number;
        feedback: string;
    }
}