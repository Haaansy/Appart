import { Timestamp } from "firebase/firestore";
import Apartment from "./Apartment";
import Transient from "./Transient";

export type PropertyRecommendation = Apartment | Transient;

export interface Message {
  id?: string;
  text: string;
  isUser: boolean;
  recommendations?: PropertyRecommendation[];
  createdAt?: Timestamp;
}

export default interface CasaBotConversation {
  id?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  createdBy: string;
  title: string;
  messages: Message[];
}