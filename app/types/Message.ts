import { Timestamp } from "firebase/firestore";
import UserData from "./UserData";

export default interface Message {
    id?: string;
    sender: UserData;
    message: string;
    createdAt?: Timestamp;
}