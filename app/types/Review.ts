import { Timestamp } from "firebase/firestore";

export default interface Review {
  userId: string;
  feedback: string;
  rating: number;
  createdAt?: Timestamp;
}