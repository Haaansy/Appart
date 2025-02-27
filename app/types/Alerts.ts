import { UserData } from "./UserData";

export interface Alert {
    sender?: UserData;
    message: string;
    isInquiry: boolean;
    isRead: boolean;
    createdAt: number;
    id?: string;
    owner: string;
}