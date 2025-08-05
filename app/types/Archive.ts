import { Timestamp } from "firebase/firestore";
import Apartment from "./Apartment";
import Transient from "./Transient";

export default interface Archive {
  id?: string;
  data: Apartment | Transient;
  type: "apartment" | "transient";
  status: "unavailable" | "deleted";
  originalPath: string;
  archivedAt: Timestamp;
  restoreAfter?: Timestamp;
  deleteAfter?: Timestamp;
}