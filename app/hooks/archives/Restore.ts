import { db } from "@/app/Firebase/FirebaseConfig";
import { deleteDoc, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const Restore = async (destinationCollectionName: string, documentId: string) => {
  try {
    const sourceRef = doc(db, "archives", documentId);
    const snapshot = await getDoc(sourceRef)

    if(!snapshot.exists()) {
      console.warn(`No document found in archives/${documentId}`);
      return;
    }

    const data = snapshot.data();

    const archiveData = {
      ...data,
    };

    await setDoc(doc(db, destinationCollectionName, documentId), archiveData);
    await deleteDoc(sourceRef);

    console.log(`Document ${documentId} archived successfully.`);

  } catch (error) {
    console.error(`Error in Restoration for archives/${documentId}:`, error);
  }
}

export default Restore;