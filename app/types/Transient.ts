import { Timestamp } from "firebase/firestore";
import UserData from "./UserData";
import { BookingDate } from "./BookedDates";

export default interface Transient {
    ownerId?: string;
    images: string[];
    title: string;
    status: string;
    address: string;
    coordinates: number[];
    price: number;
    description: string;
    tags: string[];
    bedRooms: number;
    bathRooms: number;
    kitchen: number;
    livingRooms: number;
    parking: number;
    maxGuests: number;
    houseRules: string[];
    requirements: string[];
    createdAt: number;
    id?: string;
    bookedDates: BookingDate[];
}