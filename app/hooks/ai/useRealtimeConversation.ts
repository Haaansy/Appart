import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/Firebase/FirebaseConfig';
import CasaBotConversation from '@/app/types/CasaBotConversation';
import { Message } from '@/app/types/CasaBotConversation';

const useRealtimeConversation = (conversationId: string | null) => {
  const [conversation, setConversation] = useState<CasaBotConversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setConversation(null);
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Set up real-time listener for the conversation document
    const unsubscribe = onSnapshot(
      doc(db, 'casabot', conversationId),
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const conversationData = {
            id: docSnapshot.id,
            title: data.title,
            messages: data.messages || [],
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            ...data
          } as CasaBotConversation;

          setConversation(conversationData);
          setMessages(conversationData.messages || []);
          setLoading(false);
        } else {
          setError('Conversation not found');
          setLoading(false);
        }
      },
      (err) => {
        console.error('Error listening to conversation:', err);
        setError('Failed to listen to conversation updates');
        setLoading(false);
      }
    );

    // Clean up listener when component unmounts or conversationId changes
    return () => unsubscribe();
  }, [conversationId]);

  return { conversation, messages, loading, error };
};

export default useRealtimeConversation;
