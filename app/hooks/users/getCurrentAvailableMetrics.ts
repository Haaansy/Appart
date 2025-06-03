import { useEffect, useState } from "react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const useCurrentAvailableMetrics = () => {
  const [monthYearArr, setMonthYearArr] = useState<{ month: string; year: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setMonthYearArr([]);
          setLoading(false);
          return;
        }
        const db = getFirestore();
        const userDocRef = doc(db, "User_Metrics", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          const arr = Array.isArray(data.AvailableMonth_Year) ? data.AvailableMonth_Year : [];
          const parsed = arr.map((entry: string) => {
            const [month, year] = entry.split("_");
            return { month, year };
          });
          setMonthYearArr(parsed);
        } else {
          setMonthYearArr([]);
        }
      } catch (error) {
        setMonthYearArr([]);
        console.log("[DEBUG] Error fetching available metric ids:", error);
      }
      setLoading(false);
    };

    fetchMetrics();
  }, []);

  return { monthYearArr, loading };
};

export default useCurrentAvailableMetrics;
