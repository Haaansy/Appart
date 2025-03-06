import { Timestamp } from "firebase/firestore";
import UserData from "./UserData";
import Message from "./Message";

interface unreadCounts {
    user: UserData;
    count: number;
}

export default interface Conversation {
    id: string;
    createdAt: Timestamp;
    lastMessage: string;
    members: unreadCounts[];
    propertyId: string;
    bookingRef: string;
    messages: Message[];
}