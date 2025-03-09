import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig"; // Adjust path as needed
import Conversation from "@/app/types/Conversation";
import UserData from "@/app/types/UserData";

export const checkExistingConversation = async (
  propertyId: string,
  owner: UserData,
  currentUser: UserData
): Promise<Conversation | null> => {
  try {
    console.log("[DEBUG] Checking for existing conversation...");

    if (!propertyId || !owner || !currentUser) {
      console.log("[DEBUG] Missing required parameters.");
      return null;
    }

    // Collect all member IDs
    const memberIds = [
      currentUser.id,
      owner.id,
    ];

    console.log("[DEBUG] Member IDs to check:", memberIds);

    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("propertyId", "==", propertyId),
      where("memberIds", "array-contains", currentUser.id) // Ensure user is part of the conversation
    );

    const snapshot = await getDocs(q);

    // Filter conversations where all member IDs match
    let foundConversation: Conversation | null = null;
    snapshot.forEach((doc) => {
      const data = doc.data() as Conversation;
      const hasAllMembers = memberIds.every((id) => data.memberIds?.includes(id));
      if (hasAllMembers) {
        foundConversation = { id: doc.id, ...data };
        console.log("[DEBUG] Found existing conversation:", foundConversation);
      }
    });

    return foundConversation;
  } catch (error) {
    console.error("[ERROR] Error checking conversation:", error);
    return null;
  }
};
