import { useState } from "react";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import { createMessage } from "@/app/Firebase/Services/DatabaseService";
import Conversation from "@/app/types/Conversation";
import UserData from "@/app/types/UserData";

const useSendMessage = (conversationId: string, currentUserData: UserData | null) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (message: string) => {
    if (!message.trim() || !currentUserData) return;
    setLoading(true);
    setError(null);

    try {
      // Send message to Firestore subcollection
      await createMessage(conversationId, {
        sender: currentUserData,
        message: message.trim(),
      });

      // Get the conversation document
      const conversationRef = doc(db, "conversations", conversationId);
      const conversationSnap = await getDoc(conversationRef);

      if (!conversationSnap.exists()) {
        throw new Error("Conversation not found");
      }

      const conversationData = conversationSnap.data() as Conversation;

      // Increment unread count for all members except the sender
      const updatedMembers = conversationData.members.map((member) => ({
        ...member,
        count: member.user.id !== currentUserData.id ? member.count + 1 : member.count,
      }));

      // Update conversation with last message, last sender, and unread counts
      await updateDoc(conversationRef, {
        lastMessage: message.trim(),
        lastSender: currentUserData,
        members: updatedMembers,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
};

export default useSendMessage;
