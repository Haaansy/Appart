import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig"; // Adjust path as needed
import Conversation from "@/app/types/Conversation";
import UserData from "@/app/types/UserData";

export const checkExistingConversationWithTenants = async (
  propertyId: string,
  tenantIds: string[],
  ownerId: string,
): Promise<Conversation | null> => {
  try {
    console.log(tenantIds, ownerId);

    if (!propertyId || tenantIds.length === 0 || !ownerId) {
      return null;
    }

    // Collect all member IDs
    const memberIds = [
      ...tenantIds.map((tenant) => tenant),
      ownerId,
    ];

    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("propertyId", "==", propertyId),
      where("memberIds", "==", memberIds) // Ensure user is part of the conversation
    );

    const snapshot = await getDocs(q);

    // Filter conversations where all member IDs match
    let foundConversation: Conversation | null = null;
    snapshot.forEach((doc) => {
      const data = doc.data() as Conversation;
      const hasAllMembers = memberIds.every((id) => data.memberIds?.includes(id as string));
      if (hasAllMembers) {
        foundConversation = { id: doc.id, ...data };
      }
    });

    return foundConversation;
  } catch (error) {
    console.error("[ERROR] Error checking conversation:", error);
    return null;
  }
};
