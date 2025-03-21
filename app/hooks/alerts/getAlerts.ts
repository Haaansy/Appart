import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/app/Firebase/FirebaseConfig'; // Adjust path as needed
import { FirebaseError } from 'firebase/app';
import Alert from '@/app/types/Alert';

// Debounce function to limit the frequency of setting up the Firestore listener
const debounce = (func: Function, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: any[]) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const getAlerts = (userId: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError>();

  useEffect(() => {
    if (!userId) return;

    const setupListener = debounce(() => {
      const alertsRef = collection(db, 'alerts');
      const q = query(
        alertsRef,
        where('receiverId', '==', userId),
        orderBy('createdAt', 'desc') // Order alerts by time created (latest first)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const alertsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAlerts(alertsData as Alert[]);
        setLoading(false);
      }, (err) => {
        console.error('Error fetching alerts:', err);
        setError(err as FirebaseError);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      }; // Cleanup listener on unmount
    }, 300); // Adjust delay as needed

    setupListener();

  }, [userId]);

  return { alerts, loading, error };
};

export default getAlerts;
