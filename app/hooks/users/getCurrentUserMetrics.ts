import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/Firebase/FirebaseConfig';

interface UserMetrics {
  avg_apartment_price: number;
  avg_transient_price: number;
  bookings: number;
  forecasted_income: number;
  occupancy_rate: number;
  property_posted: number;
  total_guest: number;
}

export const useCurrentUserMetrics = () => {
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserMetrics = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (!currentUser) {
          setError('No user is signed in');
          setLoading(false);
          return;
        }

        const userId = currentUser.uid;
        const metricsRef = doc(db, 'User_Metrics', userId);
        const metricsSnap = await getDoc(metricsRef);

        if (metricsSnap.exists()) {
          setMetrics(metricsSnap.data() as UserMetrics);
        } else {
          setMetrics(null);
        }
      } catch (err) {
        setError(`Failed to fetch user metrics: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserMetrics();
  }, []);

  return { metrics, loading, error };
};