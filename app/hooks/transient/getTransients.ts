import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import Transient from "@/app/types/Transient";

/**
 * Calculates distance between two coordinates using the Haversine formula
 */
const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return R * c; // Distance in km
};

export const getTransients = (
    role: string, 
    userId: string,
    currentLocation?: { latitude: number; longitude: number }
) => {
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

            // Remove ordering if we plan to sort by distance
            transientQuery = query(transientQuery, limit(LIMIT));

            if (!reset && lastDoc) {
                transientQuery = query(transientQuery, startAfter(lastDoc));
            }

            console.log("Firestore Query: ", transientQuery);
            const snapshot = await getDocs(transientQuery);

            if (snapshot.empty) {
                console.log("⚠️ No more transient found!");
                setHasMore(false);
            }

            let transientList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data() as Transient,
            }));

            // If current location is provided, calculate distance and sort by proximity
            if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
                transientList = transientList.map(transient => {
                    const distance = transient.coordinates && transient.coordinates[0] && transient.coordinates[1]
                        ? calculateDistance(
                            currentLocation.latitude,
                            currentLocation.longitude,
                            transient.coordinates[0],
                            transient.coordinates[1]
                          )
                        : Number.MAX_VALUE; // Place transients without location at the end
                    
                    return { ...transient, distance };
                }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
            } else {
                // If no location, order by created date
                transientList.sort((a, b) => b.createdAt - a.createdAt);
            }

            setTransients((prev) => (reset ? transientList : [...prev, ...transientList]));
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

        } catch (err: any) {
            console.error("❌ Firestore Error: ", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [role, userId, lastDoc, hasMore, loading, currentLocation]);

    // Fetch on mount
    useEffect(() => {
        fetchTransients(true);
    }, [role, userId, currentLocation]);

    return { transients, loading, error, fetchMore: () => fetchTransients(), refresh: () => fetchTransients(true) };
};
