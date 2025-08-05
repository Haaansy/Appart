import { db } from "@/app/Firebase/FirebaseConfig";
import { deleteDoc, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";

const ArchiveDocument = async (collectionName: string, documentId: string, status: "unavailable" | "deleted") => {
  try {
    const sourceRef = doc(db, collectionName, documentId);
    const snapshot = await getDoc(sourceRef)

    if(!snapshot.exists()) {
      console.warn(`No document found in ${collectionName}/${documentId}`);
      return;
    }

    const data = snapshot.data();
    const now = Timestamp.now();

    const archiveData = {
      ...data,
      type: collectionName === 'apartments' ? 'apartment' : 'transient',
      status, // "unavailable" or "deleted"
      originalPath: `${collectionName}/${documentId}`,
      archivedAt: now,
      restoreAfter: null,
      deleteAfter: status === "deleted" ? Timestamp.fromDate(new Date(now.toDate().getTime() + 14 * 24 * 60 * 60 * 1000)) : null,
    };

    await setDoc(doc(db, 'archives', documentId), archiveData);
    await deleteDoc(sourceRef);

    console.log(`Document ${documentId} archived successfully.`);

  } catch (error) {
    console.error(`Error in ArchiveDocument for ${collectionName}/${documentId}:`, error);
  }
}

export default ArchiveDocument;