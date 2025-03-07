import { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import Message from "@/app/types/Message";

const useFetchMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const messagesRef = collection(db, "conversations", conversationId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc")); // Order messages by time

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedMessages: Message[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];

        setMessages(fetchedMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, [conversationId]);

  return { messages, loading, error };
};

export default useFetchMessages;
