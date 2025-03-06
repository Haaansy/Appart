import UserData from "./UserData";

export default interface Tenant {
    user: UserData;
    status: "Invited" | "Accepted" | "Declined" | "Host" | "Evicted";
}