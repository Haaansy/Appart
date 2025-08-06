import { db } from "@/app/Firebase/FirebaseConfig";
import { deleteDoc, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import getCurrentUserData from "../users/getCurrentUserData";
import { set } from "date-fns";

const useArchives = (status: "archives" | "deleted") => {
  const [archives, setArchives] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchArchives = async () => {
    try {
      setLoading(true);
      const archivesRef = collection(db, "archives");
      const statusValue = status === "archives" ? "unavailable" : "deleted";

      const q = query(
        archivesRef,
        where("ownerId", "==", currentUserId),
        where("status", "==", statusValue)
      );

      const querySnapshot = await getDocs(q);
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setArchives(documents);
      setLoading(false);

    } catch (error) {
      console.error(`Error in useArchives: `, error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCurrentUserId = async () => { 
      setLoading(true);
      const user = await getCurrentUserData();

      if (!user) {
        setLoading(false);
        throw new Error("No user data found");
        
      }

      setCurrentUserId(user?.id || null);
      setLoading(false);
    };

    fetchCurrentUserId();
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchArchives();
    }
  }, [currentUserId, status]);

  return {
    archives,
    fetchArchives,
    loading
  };
}

export default useArchives;