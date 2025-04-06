import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/app/Firebase/FirebaseConfig'; // Adjust path as needed
import { FirebaseError } from 'firebase/app';
import Alert from '@/app/types/Alert';

// Debounce function to limit the frequency of setting up the Firestore listener
const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>): ReturnType<T> | undefined => {
    if (timeoutId) clearTimeout(timeoutId);
    let result: ReturnType<T> | undefined;
    timeoutId = setTimeout(() => {
      result = func(...args);
    }, delay);
    return result;
  };
};

const getAlerts = (userId: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError | null>(null);

  useEffect(() => {
    // Reset states when userId changes or is empty
    setLoading(userId ? true : false);
    setError(null);
    
    // No user ID means user probably logged out
    if (!userId) {
      setAlerts([]);
      setLoading(false);
      return;
    }

    let unsubscribeFunc: (() => void) | undefined;

    // Setup listener without debounce to fix the error
    const alertsRef = collection(db, 'alerts');
    const q = query(
      alertsRef,
      where('receiverId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    unsubscribeFunc = onSnapshot(q, (snapshot) => {
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
    
    // Always return a cleanup function
    return () => {
      if (unsubscribeFunc) {
        unsubscribeFunc();
      }
    };
  }, [userId]);

  return { alerts, loading, error };
};

export default getAlerts;
