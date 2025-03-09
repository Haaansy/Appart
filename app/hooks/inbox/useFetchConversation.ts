import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import Conversation from "@/app/types/Conversation";
import { useState, useEffect } from "react";

const useFetchConversations = (user: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    setError(null);

    const conversationsRef = collection(db, "conversations");

    // Query conversations ordered by updatedAt in descending order
    const q = query(conversationsRef, orderBy("updatedAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedConversations: Conversation[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();

          // 🔍 Filter members manually since Firestore can't query inside arrays
          const isMember = data.members.some(
            (member: { user: { id: string }; count: number }) => member.user.id === user
          );

          if (isMember) {
            fetchedConversations.push({
              id: doc.id,
              createdAt: data.createdAt,
              lastMessage: data.lastMessage,
              lastSender: data.lastSender,
              members: data.members,
              propertyId: Array.isArray(data.propertyId) ? data.propertyId[0] : data.propertyId,
              bookingId: data.bookingId,
              type: data.type,
              inquiryType: data.inquiryType,
              updatedAt: data.updatedAt
            });
          }
        });

        setConversations(fetchedConversations);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching conversations:", error);
        setError("Failed to fetch conversations");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  return { conversations, loading, error };
};

export default useFetchConversations;
