import { FieldValue, Timestamp } from "firebase/firestore";
import Tenant from "./Tenant";

export default interface Booking {
    id?: string;
    type: "Apartment" | "Transient";
    propertyId: string;
    status: "Booked" | "Pending Invitation" | "Viewing Confirmed" | "Booking Confirmed" | "Booking Declined" | "Booking Completed" | "Booking Cancelled";
    bookedDate: Timestamp[];
    leaseDuration: number;
    tenants: Tenant[];
    tenantIds?: string[];
    viewingDate?: Timestamp;
    owner: string;
    createdAt?: Timestamp | FieldValue;
    conversationId?: string;
    declinedReason?: string;
    reason?: string;
    reasonType?: "Decline" | "Cancel";
}