// src/types.ts

import Review from "./Review";

export interface BirthDate {
    month: string;
    day: string;
    year: string;
}

export default interface UserData {
    id?: string;
    firstName: string;
    lastName: string;
    birthDate?: BirthDate;
    emergencyContact: string;
    emergentContactNumber: string;
    coverUrl: string;
    sex: string;
    role: string;
    email: string | null;
    displayName: string;
    photoUrl: string;
    phoneNumber: string;
    isAdmin: boolean;
    reviews: Review[];
    verified?: boolean;
    isVerifying?: boolean;
    businessPermitURL?: string;

}
