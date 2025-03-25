import { updateApartment } from "@/app/Firebase/Services/DatabaseService";
import { useApartment } from "./useApartment";

const clearApartment = async (apartmentId: string) => {
  const { apartment, loading, error } = useApartment(apartmentId);

  try {
    await updateApartment(apartmentId, {
      ...apartment,
      viewingDates: [],
      bookingDates: []
    });

    console.log(`Cleared dates for apartment ${apartmentId}`);
    return true;
  } catch (error) {
    console.error('Failed to clear apartment dates:', error);
    return false;
  }
};

export default clearApartment