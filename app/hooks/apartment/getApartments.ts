import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import Apartment from "../../types/Apartment";

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
 * Fetches apartments based on the user's role, userId, and current location.
 * 
 * @param {string} role - The role of the user (e.g., "home owner").
 * @param {string} userId - The unique identifier of the user.
 * @param {Object} currentLocation - The user's current location coordinates.
 * @param {number} currentLocation.latitude - The latitude of the user's location.
 * @param {number} currentLocation.longitude - The longitude of the user's location.
 * 
 * @returns {Object} - An object containing:
 *   - `apartments`: An array of fetched apartments sorted by proximity.
 *   - `loading`: A boolean indicating if the fetch operation is in progress.
 *   - `error`: A string containing an error message, if any.
 *   - `fetchMore`: A function to fetch more apartments.
 *   - `refresh`: A function to refresh the list of apartments.
 */
export const getApartments = (
    role: string, 
    userId: string, 
    currentLocation?: { latitude: number; longitude: number }
) => {
    const [apartments, setApartments] = useState<Apartment[]>([]); // Explicitly typed as Apartment[]
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [hasMore, setHasMore] = useState(true);

    const LIMIT = 5; // Fetch 5 items per page

    const fetchApartments = useCallback(async (reset = false) => {
        if (!role || !userId || loading || (!reset && !hasMore)) return;

        setLoading(true);
        setError(null);

        try {
            console.log(`Fetching apartments for role: ${role}, userId: ${userId}`);
            const apartmentsRef = collection(db, "apartments");
            let apartmentsQuery =
                role === "home owner"
                    ? query(apartmentsRef, where("ownerId", "==", userId))
                    : apartmentsRef;

            // Remove ordering by createdAt since we'll order by distance later
            apartmentsQuery = query(apartmentsQuery, where("status", "==", "Available"), limit(LIMIT));
            if (!reset && lastDoc) {
                apartmentsQuery = query(apartmentsQuery, startAfter(lastDoc));
            }

            const snapshot = await getDocs(apartmentsQuery);

            if (snapshot.empty) {
                console.log("⚠️ No more apartments found!");
                setHasMore(false);
            }

            let apartmentList: Apartment[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Apartment),
            }));

            // If current location is provided, calculate distance and sort by proximity
            if (currentLocation && currentLocation.latitude && currentLocation.longitude) {
                apartmentList = apartmentList.map(apartment => {
                    const distance = apartment.coordinates && apartment.coordinates[0] && apartment.coordinates[1]
                        ? calculateDistance(
                            currentLocation.latitude,
                            currentLocation.longitude,
                            apartment.coordinates[0],
                            apartment.coordinates[1]
                          )
                        : Number.MAX_VALUE; // Place apartments without location at the end
                    
                    return { ...apartment, distance };
                }).sort((a, b) => (a.distance || 0) - (b.distance || 0));
            }

            setApartments((prev) => (reset ? apartmentList : [...prev, ...apartmentList]));
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            
        } catch (err: any) {
            console.error("❌ Firestore Error: ", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [role, userId, lastDoc, hasMore, loading, currentLocation]);

    useEffect(() => {
        fetchApartments(true);
    }, [role, userId, currentLocation]); // Add currentLocation as dependency

    return { 
        apartments, 
        loading, 
        error, 
        fetchMore: () => fetchApartments(), 
        refresh: () => fetchApartments(true) 
    };
};
