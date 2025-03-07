import { Timestamp } from "firebase/firestore";
import UserData from "./UserData";
import Message from "./Message";

interface Member {
    user: UserData;
    count: number;
}

export default interface Conversation {
    id?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
    lastMessage: string;
    lastSender: UserData;
    members: Member[];
    memberIds: string[];
    propertyId: string;
    bookingId?: string;
    messages: Message[];
    type: "Inquiry" | "Booking";
    inquiryType?: "Apartment" | "Transient"
}