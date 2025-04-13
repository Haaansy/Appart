// services/MessageService.ts
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/Firebase/FirebaseConfig'; // adjust this path as needed
import CasaBotConversation from '@/app/types/CasaBotConversation';

export const createConversation = async ({
  conversation,
}: {
  conversation: CasaBotConversation
}) => {
  const conversationsRef = collection(db, 'casabot');
  const doc = await addDoc(conversationsRef, conversation)
  return doc.id;
};
