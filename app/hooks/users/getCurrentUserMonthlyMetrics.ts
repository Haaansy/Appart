import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/app/Firebase/FirebaseConfig';

interface UserMetrics {
  createdAt: any; // Using any for Firebase timestamp
  userId: string;
  forecasted_income: number;
  occupancy_rate: number;
  tenants: number;
  guest: number;
  bookings: number;
  properties: number;
  apartments: number;
  transients: number;
}

export const useCurrentUserMonthlyMetrics = () => {
  const [monthlyMetrics, setMonthlyMetrics] = useState<UserMetrics[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMonthlyMetrics = async () => {
    try {
      setLoading(true);
      setError(null);
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError('No user is signed in');
        setLoading(false);
        return;
      }

      const userId = currentUser.uid;

      // Get Manila time
      const now = new Date();
      const manilaTime = new Date(now.getTime() + (8 * 60 * 60 * 1000));
      const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];
      const currentMonth = monthNames[manilaTime.getUTCMonth()];
      const currentYear = manilaTime.getUTCFullYear();

      // Format collection name
      const monthYearCollection = `${currentMonth}_${currentYear}`;

      // Reference to the month collection
      const monthCollectionRef = collection(
        doc(collection(db, 'User_Metrics'), userId),
        monthYearCollection
      );

      // Get all documents in the month collection
      const querySnapshot = await getDocs(query(monthCollectionRef));
      
      const metrics: UserMetrics[] = [];
      querySnapshot.forEach((doc) => {
        metrics.push(doc.data() as UserMetrics);
      });

      setMonthlyMetrics(metrics);
    } catch (err) {
      setError(`Failed to fetch monthly metrics: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlyMetrics();
  }, []);

  const refresh = () => {
    fetchMonthlyMetrics();
  };

  return { monthlyMetrics, loading, error, refresh };
};