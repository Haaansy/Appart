import { useRouter } from "expo-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import Conversation from "@/app/types/Conversation";
import UserData from "@/app/types/UserData";

const useHandleConversationPress = (currentUserData: UserData | null) => {
  const router = useRouter();

  const handleConversationPress = async (conversation: Conversation) => {
    if (!currentUserData) return;

    try {
      const conversationRef = doc(db, "conversations", conversation.id!);

      await updateDoc(conversationRef, {
        members: conversation.members.map((member) =>
          member.user.id === currentUserData.id
            ? { ...member, count: 0 } // Reset unread count for current user
            : member
        ),
      });

      // Navigate to conversation
      router.push(`/(Authenticated)/(inbox)/(viewconversation)/${conversation.id}`);
    } catch (error) {
      console.error("Error clearing unread counts:", error);
    }
  };

  return { handleConversationPress };
};

export default useHandleConversationPress;
