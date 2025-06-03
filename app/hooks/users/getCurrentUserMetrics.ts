import { useEffect, useState, useCallback } from "react";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

export const useCurrentUserMetrics = (month?: string, year?: string) => {
  const [metrics, setMetrics] = useState<any>(null);
  const [latestMetric, setLatestMetric] = useState<any>(null); // Add state for latest document
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetricsForMonthYear = useCallback(async (month: string, year: string) => {
    setLoading(true);
    setError(null);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
 
      const db = getFirestore();
      const monthYearKey = `${month}_${year}`;
      
      // Access the subcollection User_Metrics/{userId}/{month}_{year}
      const subcollectionRef = collection(db, "User_Metrics", user.uid, monthYearKey);
      const querySnapshot = await getDocs(subcollectionRef);
      
      if (!querySnapshot.empty) {
        // Get all documents in the subcollection
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
                
        // Sort documents by createdAt timestamp in descending order (newest first)
        // Adjust the field name if you're using a different timestamp field
        const sortedDocuments = documents.sort((a, b) => {
          // Handle different timestamp formats
          const getTimestamp = (doc: any) => {
            if (doc.createdAt?.seconds) {
              // Firestore timestamp
              return doc.createdAt.seconds;
            } else if (doc.createdAt instanceof Date) {
              // Date object
              return doc.createdAt.getTime() / 1000;
            } else if (typeof doc.createdAt === 'number') {
              // Unix timestamp
              return doc.createdAt;
            }
            return 0;
          };
          
          return getTimestamp(b) - getTimestamp(a);
        });
        
        // Set all documents
        setMetrics(sortedDocuments);
        
        // Set the latest document
        if (sortedDocuments.length > 0) {
          setLatestMetric(sortedDocuments[0]);
        }
      } else {
        setMetrics(null);
        setLatestMetric(null);
        setError(`No data available for ${month}_${year}`);
      }
    } catch (err: any) {
      setError("Failed to load metrics data");
      setMetrics(null);
      setLatestMetric(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoading(true);
      setError(null);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        // If month and year are provided, use them, otherwise use current month/year
        if (month && year) {
          await fetchMetricsForMonthYear(month, year);
        } else {
          const currentDate = new Date();
          const currentMonth = currentDate.getMonth().toString();
          const currentYear = currentDate.getFullYear().toString();

          await fetchMetricsForMonthYear(currentMonth, currentYear);
        }
      } catch (err: any) {
        setError("Failed to load metrics data");
        setMetrics(null);
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [month, year, fetchMetricsForMonthYear]);

  return { metrics, latestMetric, loading, error, fetchMetricsForMonthYear };
};