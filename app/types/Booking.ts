import { Timestamp } from "firebase/firestore";
import { Tenant } from "./Tenant";

export interface Booking {
    id?: string;
    isApartment: Boolean;
    propertyId: string;
    status: "Booked" | "Pending Invitation" | "Viewing Confirmed" | "Booking Confirmed" | "Booking Declined" | "Booking Completed";
    bookedDate: Timestamp[];
    leaseDuration: number;
    tenants: Tenant[];
    viewingDate?: Timestamp;
}