import { db } from "@/app/Firebase/FirebaseConfig";
import { collection, query, where, getDocs, writeBatch } from "firebase/firestore";

const useBatchDeclineBookings = async (propertyId: string, bookingId: string) => {
  try {
    const batch = writeBatch(db);

    // Query for all bookings with the specified propertyId
    const bookingsRef = collection(db, "bookings");
    const bookingsQuery = query(bookingsRef,
      where("propertyId", "==", propertyId),
      where("id", "!=", bookingId));
    const bookingsSnapshot = await getDocs(bookingsQuery);

    let count = 0;

    // Add each booking to the batch update
    bookingsSnapshot.forEach((doc) => {
      batch.update(doc.ref, { status: "Booking Declined" });
      count++;
    });

    // Commit the batch
    if (count > 0) {
      await batch.commit();
      return { success: true, count };
    } else {
      return { success: true, count: 0, message: "No bookings found for this property" };
    }
  } catch (error) {
    console.error("Error declining bookings:", error);
    return { success: false, error };
  }
};

export default useBatchDeclineBookings;