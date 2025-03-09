import { Timestamp } from "firebase/firestore";
import UserData from "./UserData";
import { BookingDate } from "./BookedDates";

export default interface Apartment {
    ownerId?: string;
    images: string[];
    title: string;
    status: string;
    address: string;
    coordinates: number[];
    price: number;
    securityDeposit: number;
    description: string;
    tags: string[];
    bedRooms: number;
    bathRooms: number;
    kitchen: number;
    livingRooms: number;
    parking: number;
    area: number;
    levels: number;
    maxTenants: number;
    electricIncluded: boolean;
    waterIncluded: boolean;
    internetIncluded: boolean;
    houseRules: string[];
    requirements: string[];
    leaseTerms: number[];
    createdAt: number;
    id?: string;
    bookedDates: BookingDate[];
    viewingDates: BookingDate[];
}