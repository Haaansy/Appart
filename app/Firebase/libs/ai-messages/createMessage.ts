// services/MessageService.ts
import { doc, serverTimestamp, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/app/Firebase/FirebaseConfig'; // adjust this path as needed
import { Message } from '@/app/types/CasaBotConversation';

export const createMessage = async ({
  conversationId,
  message
}: {
  conversationId: string;
  message: Message;
}) => {
  const documentRef = doc(db, `casabot/${conversationId}`);

  // Get the current document to access its messages array
  const docSnap = await getDoc(documentRef);
  const currentMessages = docSnap.exists() ? (docSnap.data().messages || []) : [];

  await updateDoc(documentRef, {
    messages: [...currentMessages, message],
    updatedAt: serverTimestamp(),
  }).then(() => {
    console.log('Message added to conversation', message);
    return docSnap.id;
  }).catch((error) => {
    console.error('Error adding message to conversation: ', error);
    throw error;
  });
};
