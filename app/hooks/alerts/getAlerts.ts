import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/app/Firebase/FirebaseConfig'; // Adjust path as needed
import { FirebaseError } from 'firebase/app';
import { Alert } from '@/app/types/Alert';

const getAlerts = (userId: string) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError>();

  useEffect(() => {
    if (!userId) return;

    const alertsRef = collection(db, 'alerts');
    const q = query(alertsRef, where('receiver.id', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const alertsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAlerts(alertsData as Alert[]);
      setLoading(false);
    }, (err) => {
      console.error('Error fetching alerts:', err);
      setError(err as FirebaseError);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener on unmount
  }, [userId]);

  return { alerts, loading, error };
};

export default getAlerts;
