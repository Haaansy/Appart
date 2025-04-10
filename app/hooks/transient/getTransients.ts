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

/**
 * Fetches transients based on the user's role, userId, and current location.
 * 
 * @param {string} role - The role of the user (e.g., "home owner").
 * @param {string} userId - The unique identifier of the user.
 * @param {Object} currentLocation - The user's current location coordinates.
 * @param {number} currentLocation.latitude - The latitude of the user's location.
 * @param {number} currentLocation.longitude - The longitude of the user's location.
 * 
 * @returns {Object} - An object containing:
 *   - `transients`: An array of fetched transients sorted by proximity.
 *   - `loading`: A boolean indicating if the fetch operation is in progress.
 *   - `error`: A string containing an error message, if any.
 *   - `fetchMore`: A function to fetch more transients.
 *   - `refresh`: A function to refresh the list of transients.
 *   - `noTransientsNearby`: A boolean indicating if there are no transients within the specified radius.
 */
export const getTransients = (
    role: string, 
    userId: string,
    currentLocation?: { latitude: number; longitude: number }
) => {
    const [transients, setTransients] = useState<Transient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);
    const [noTransientsNearby, setNoTransientsNearby] = useState(false);

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
                const filteredList = transientList.map(transient => {
                    // Check if coordinates array exists and has at least 2 elements
                    const hasValidCoordinates = transient.coordinates && 
                                               Array.isArray(transient.coordinates) && 
                                               transient.coordinates.length >= 2;
                    
                    const distance = hasValidCoordinates
                        ? calculateDistance(
                            currentLocation.latitude,
                            currentLocation.longitude,
                            transient.coordinates[1],
                            transient.coordinates[0]
                          )
                        : Number.MAX_VALUE; // Place transients without location at the end
                    
                    return { ...transient, distance };
                })
                .filter(transient => {
                    // Only show transients with valid distances within 20km
                    return typeof transient.distance === 'number' && 
                           transient.distance !== Number.MAX_VALUE && 
                           transient.distance <= 20;
                })
                .sort((a, b) => {
                    // Safe sorting with nullish coalescing
                    return (a.distance ?? Number.MAX_VALUE) - (b.distance ?? Number.MAX_VALUE);
                });
                
                // Set flag if no transients are nearby
                setNoTransientsNearby(filteredList.length === 0);
                transientList = filteredList;
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

    return { 
        transients, 
        loading, 
        error, 
        fetchMore: () => fetchTransients(), 
        refresh: () => fetchTransients(true),
        noTransientsNearby
    };
};
