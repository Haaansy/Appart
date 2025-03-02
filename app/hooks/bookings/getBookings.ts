import { useState, useEffect } from "react";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";
import { Booking } from "@/app/types/Booking";

const getBookings = (status: string) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const db = getFirestore();

  useEffect(() => {
    const bookingsRef = collection(db, "bookings");
    const bookingsQuery = query(bookingsRef, where("status", "==", status));

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Booking[];
        setBookings(bookingList);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup Firestore listener on unmount
  }, [status]);

  return { bookings, loading, error };
};

export default getBookings;
