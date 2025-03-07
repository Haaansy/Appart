import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import Conversation from "@/app/types/Conversation";

const useConversation = (conversationId: string) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const conversationRef = doc(db, "conversations", conversationId);

    // Listen for real-time updates
    const unsubscribe = onSnapshot(
      conversationRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setConversation({ id: docSnapshot.id, ...docSnapshot.data() } as Conversation);
        } else {
          setConversation(null);
          setError("Conversation not found");
        }
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching conversation:", err);
        setError("Failed to fetch conversation");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [conversationId]);

  return { conversation, loading, error };
};

export default useConversation;
