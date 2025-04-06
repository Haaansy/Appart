import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/app/Firebase/FirebaseConfig";
import Tenant from "@/app/types/Tenant";
import UserData from "@/app/types/UserData";
import getCurrentUserData from "../users/getCurrentUserData";

const useCheckExistingBooking = (propertyId: string) => {
  const [hasExistingBooking, setHasExistingBooking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkBooking = async () => {

      const userData: UserData = await getCurrentUserData() as UserData;
      if (!userData || !propertyId) {
        setLoading(false);
        return;
      }

      try {
        const bookingsRef = collection(db, "bookings");
        const q = query(
          bookingsRef,
          where("propertyId", "==", propertyId),
          where("status", "in", ["Booked", "Pending Invitation", "Booking Confirmed", "Viewing Confirmed"]) // ✅ Active bookings
        );

        const snapshot = await getDocs(q);
        
        // ✅ Manually filter tenants with userData.uid
        const userHasBooking = snapshot.docs.some((doc) => {
          const bookingData = doc.data();
          return bookingData.tenants.some((tenant: Tenant) => tenant.user.id === userData.id);
        });

        setHasExistingBooking(userHasBooking);
      } catch (error) {
        console.error("Error checking existing booking:", error);
      } finally {
        setLoading(false);
      }
    };

    checkBooking();
  }, [propertyId]);

  return { hasExistingBooking, loading };
};

export default useCheckExistingBooking;
