import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../Firebase/FirebaseConfig";

export const useTransient = (transientId: string) => {
    const [transient, setTransient] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransient = async () => {
            if (!transientId) return;

            setLoading(true);
            setError(null);

            try {
                console.log(`Fetching transient with ID: ${transientId}`);

                const transientRef = doc(db, "transients", transientId);
                const transientSnap = await getDoc(transientRef);

                if (!transientSnap.exists()) {
                    throw new Error(`Transient with ID: ${transientId} not found!`);
                }

                setTransient({
                    id: transientSnap.id,
                    ...transientSnap.data(),
                });
            } catch (err: any) {
                setError(err.message);
            }

            setLoading(false);
        };

        fetchTransient();
    }, [transientId]);

    return { transient, loading, error };
}

