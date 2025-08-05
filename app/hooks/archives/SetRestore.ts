import { db } from "@/app/Firebase/FirebaseConfig";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const SetRestore = async (documentId: string) => {
  try {
    const sourceRef = doc(db, "archives", documentId);
    const snapshot = await getDoc(sourceRef)

    if(!snapshot.exists()) {
      console.warn(`No document found in archives/${documentId}`);
      return;
    }

    const now = Timestamp.now();
    const restoreDate = new Date(now.toDate());
    restoreDate.setDate(restoreDate.getDate() + 14);
    restoreDate.setHours(0, 0, 0, 0);
    const restoreAfter = Timestamp.fromDate(restoreDate);

    // Only update the restoreAfter field, merge with existing data
    await setDoc(
      doc(db, 'archives', documentId),
      { restoreAfter },
      { merge: true }
    );

    console.log(`Document ${documentId} restore date was set successfully.`);

  } catch (error) {
    console.error(`Setting Restore Date for ${documentId} Failed: `, error);
  }
}

export default SetRestore;