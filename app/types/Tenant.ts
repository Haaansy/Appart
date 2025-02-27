import { UserData } from "./UserData";

export interface Tenant {
    user: UserData;
    status: "Invited" | "Accepted" | "Declined" | "Host";
}