import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import Booking from "@/app/types/Booking";
import Apartment from "@/app/types/Apartment";
import Transient from "@/app/types/Transient";

const useBooking = (bookingId: string) => {
  const [bookingData, setBookingData] = useState<Booking | null>(null);
  const [propertyData, setPropertyData] = useState<Apartment | Transient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return;
      setLoading(true);
      try {
        const bookingRef = doc(db, "bookings", bookingId);
        const bookingSnap = await getDoc(bookingRef);

        if (bookingSnap.exists()) {
          const booking = bookingSnap.data() as Booking;
          setBookingData(booking);

          let propertyRef;
          if (booking.type === "Apartment") {
            // Try apartments collection first
            propertyRef = doc(db, "apartments", booking.propertyId);
            const apartmentSnap = await getDoc(propertyRef);

            if (!apartmentSnap.exists()) {
              // If not found, try archives collection
              propertyRef = doc(db, "archives", booking.propertyId);
            }
            
          } else if (booking.type === "Transient") {
            propertyRef = doc(db, "transients", booking.propertyId);
          }

          if (booking.type === "Apartment") {
            if (propertyRef) {
              const propertySnap = await getDoc(propertyRef);
              if (propertySnap.exists()) {
                const data = propertySnap.data();
                setPropertyData(data as Apartment);
              }
            }
          } else if (booking.type === "Transient") {
            if (propertyRef) {
              const propertySnap = await getDoc(propertyRef);

              if (propertySnap.exists()) {
                const data = propertySnap.data()

                setPropertyData(data as Transient)
              }
            }
          }
        }
      } catch (err) {
        setError("Failed to fetch booking details");
        console.error("Error fetching booking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  return { bookingData, propertyData, loading, error };
};

export default useBooking;
