import { useState, useEffect } from "react";
import { collection, query, where, getDocs, Query } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig"; // Adjust import as needed
import UserData from "@/app/types/UserData";
import getCurrentUserData from "../users/getCurrentUserData";

const useFetchBookings = (status: string, type: "Apartment" | "Transient" | "home owner") => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Fetching current user data...");
        const currentUser: UserData = await getCurrentUserData() as UserData; // Fetch current user data
        console.log("Current user data:", currentUser);

        const bookingsRef = collection(db, "bookings");
        let q;

        if (currentUser.role === "home owner") {
          console.log("User is a home owner. Fetching bookings for owner:", currentUser.id);
          q = query(
            bookingsRef,
            where("status", "==", status),
            where("type", "==", type),
            where("owner", "==", currentUser.id) // Filter by owner
          );
        } else if (currentUser.role === "tenant") {
          console.log("User is a tenant. Fetching bookings for tenant:", currentUser.id);
          q = query(
            bookingsRef,
            where("status", "==", status),
            where("type", "==", type),
            where("tenantIds", "array-contains", currentUser.id) // Filter by tenantIds
          );
        } else {
          throw new Error("Invalid user role");
        }

        console.log("Executing query...");
        const querySnapshot = await getDocs(q);
        console.log("Query executed. Number of bookings fetched:", querySnapshot.size);

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
