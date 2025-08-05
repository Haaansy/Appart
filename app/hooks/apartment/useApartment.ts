import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "../../Firebase/FirebaseConfig";
import Apartment from "@/app/types/Apartment";

export const useApartment = (apartmentId: string, bookingStatus: string) => {
    const [apartment, setApartment] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApartment = async () => {
            if (!apartmentId) return;

            setLoading(true);
            setError(null);

            try {
                console.log(`Fetching apartment with ID: ${apartmentId}`);

                let apartmentRef;
                let apartmentSnap;

                // Try apartments collection first
                apartmentRef = doc(db, "apartments", apartmentId);
                apartmentSnap = await getDoc(apartmentRef);

                if (!apartmentSnap.exists()) {
                    // If not found, try archives collection
                    apartmentRef = doc(db, "archives", apartmentId);
                }

                apartmentSnap = await getDoc(apartmentRef);

                if (!apartmentSnap.exists()) {
                    throw new Error(`Apartment with ID: ${apartmentId} not found!`);
                }

                setApartment({
                    id: apartmentSnap.id,
                    ...apartmentSnap.data(),
                });

            } catch (err: any) {
                setError(err.message);
            }

            setLoading(false);
        };

        fetchApartment();
    }, [apartmentId]);

    return { apartment, loading, error };
}

