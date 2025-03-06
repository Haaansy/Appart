import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig"; // Adjust import as needed

const useFetchBookings = (status: string, type: "Apartment" | "Transient") => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(bookingsRef, where("status", "==", status), where("type", "==", type));
        const querySnapshot = await getDocs(q);

        const fetchedBookings = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setBookings(fetchedBookings);
      } catch (err) {
        setError("Failed to fetch bookings.");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [status, type]);

  return { bookings, loading, error };
};

export default useFetchBookings;
