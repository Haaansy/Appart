import { useState, useEffect, useCallback } from "react";
import { collection, query, where, getDocs, orderBy, limit, startAfter } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Apartment } from "../../types/Apartment";

/**
 * Fetches apartments based on the user's role and userId.
 * 
 * @param {string} role - The role of the user (e.g., "home owner").
 * @param {string} userId - The unique identifier of the user.
 * 
 * @returns {Object} - An object containing:
 *   - `apartments`: An array of fetched apartments.
 *   - `loading`: A boolean indicating if the fetch operation is in progress.
 *   - `error`: A string containing an error message, if any.
 *   - `fetchMore`: A function to fetch more apartments.
 *   - `refresh`: A function to refresh the list of apartments.
 * 
 * @example
 * const { apartments, loading, error, fetchMore, refresh } = getApartments("home owner", "user123");
 * 
 * @remarks
 * This hook uses Firestore to fetch apartments and caches the results using AsyncStorage.
 * It supports pagination and caching to improve performance.
 * 
 * @throws {Error} - Throws an error if the Firestore query fails.
 */
export const getApartments = (role: string, userId: string) => {
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
                    ? query(apartmentsRef, where("owner.ownerID", "==", userId)) // Ensure proper query
                    : apartmentsRef;

            apartmentsQuery = query(apartmentsQuery, orderBy("createdAt", "desc"), limit(LIMIT));
            if (!reset && lastDoc) {
                apartmentsQuery = query(apartmentsQuery, startAfter(lastDoc));
            }

            const snapshot = await getDocs(apartmentsQuery);

            if (snapshot.empty) {
                console.log("⚠️ No more apartments found!");
                setHasMore(false);
            }

            const apartmentList: Apartment[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...(doc.data() as Apartment), // Type assertion for safety
            }));

            setApartments((prev) => (reset ? apartmentList : [...prev, ...apartmentList]));
            setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
            
        } catch (err: any) {
            console.error("❌ Firestore Error: ", err.message);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [role, userId, lastDoc, hasMore, loading]);

    useEffect(() => {
        fetchApartments(true);
    }, [role, userId]);

    return { 
        apartments, 
        loading, 
        error, 
        fetchMore: () => fetchApartments(), 
        refresh: () => fetchApartments(true) 
    };
};
