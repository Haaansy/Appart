import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";

export const getTransients = (role: string, userId: string) => {
    const [transients, setTransients] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 5; // Fetch 5 items per page (Max 15)

    const fetchTransients = useCallback(async (reset = false) => {
        if (!role || !userId || loading || (!reset && !hasMore)) return;

        setLoading(true);
        setError(null);

        try {
            console.log(`Fetching transients for role: ${role}, userId: ${userId}`);

            const transientRef = collection(db, "transients");
            let transientQuery =
                role === "home owner"
                    ? query(transientRef, where("ownerId", "==", userId)) // Ensure proper query
                    : transientRef;

            transientQuery = query(transientQuery, orderBy("createdAt", "desc"), limit(LIMIT));

            if (!reset && lastDoc) {
                transientQuery = query(transientQuery, startAfter(lastDoc));
            }

            console.log("Firestore Query: ", transientQuery);
            const snapshot = await getDocs(transientQuery);

            if (snapshot.empty) {
                console.log("⚠️ No more transient found!");
                setHasMore(false);
            }

            const apartmentList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            setTransients((prev) => (reset ? apartmentList : [...prev, ...apartmentList]));
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        } catch (err: any) {
            console.error("❌ Firestore Error: ", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [role, userId, lastDoc, hasMore, loading]);

    // Fetch on mount
    useEffect(() => {
        fetchTransients(true);
    }, [role, userId]);

    return { transients, loading, error, fetchMore: () => fetchTransients(), refresh: () => fetchTransients(true) };
};
