import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert as ReactAlert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Colors from "@/assets/styles/colors";
import DurationCard from "@/app/components/BookingComponents/DurationCard";
import Booking from "@/app/types/Booking";
import { useApartment } from "@/app/hooks/apartment/useApartment";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import CustomButton from "@/app/components/CustomButton";
import DurationPopup from "@/app/components/BookingComponents/DurationPopup";
import DateCard from "@/app/components/BookingComponents/DateCard";
import DateSelectPopup from "@/app/components/BookingComponents/DateSelectPopup";
import { Ionicons } from "@expo/vector-icons";
import { set } from "date-fns/set";
import {
  createAlert,
  createBooking,
  fetchUserDataFromFirestore,
} from "@/app/Firebase/Services/DatabaseService";
import UserData from "@/app/types/UserData";
import { router } from "expo-router";
import Alert from "@/app/types/Alert";

interface ApartmentComponentProps {
  apartment: any;
  tenantId?: string;
  noaccountData?: Partial<UserData>;
}

const ApartmentComponent = ({
  apartment,
  tenantId,
  noaccountData,
}: ApartmentComponentProps) => {
  console.log(noaccountData)
  const [tenant, setTenant] = useState<UserData | null>(null);
  useEffect(() => {
    const fetchTenantData = async () => {
      if (tenantId) {
        const tenantData = await fetchUserDataFromFirestore(tenantId);
        if (tenantData) {
          setTenant(tenantData);
          setBookingData((prevData) => ({
            ...prevData,
            tenants: [
              {
                status: "Host",
                user: tenantData,
              },
            ],
            propertyId: apartment.id,
            tenantIds: [tenantId],
          }));
        } else {
          ReactAlert.alert("Error", "Tenant data not found.");
        }
      } else {
        setTenant(noaccountData as UserData);
        setBookingData((prevData) => ({
          ...prevData,
          tenants: [
            {
              status: "Host",
              user: noaccountData as UserData,
            },
          ],
          propertyId: apartment.id,
          tenantIds: ["001"]
        }));
      }
    };

    fetchTenantData();
  }, []);

  const [bookingData, setBookingData] = useState<Booking>({
    id: "",
    type: "Apartment",
    propertyId: apartment.id || "",
    status: "Booking Confirmed",
    bookedDate: [],
    leaseDuration: 0,
    tenants: [],
    tenantIds: [],
    viewingDate: Timestamp.fromMillis(Date.now()),
    owner: apartment.ownerId as string,
  });
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [leaseDateModalVisible, setLeaseDateModalVisible] = useState(false);

  const handleSelectDuration = (duration: number) => {
    setBookingData((prevData) => {
      const updatedData = {
        ...prevData,
        leaseDuration: duration,
        bookedDate: [],
      };
      return updatedData;
    });

    setDurationModalVisible(false); // Close the popup
  };

  const handleSelectStartDate = (date: number) => {
    const selectedDate = Timestamp.fromMillis(date);
    const currentDate = Timestamp.now(); // Get current timestamp
    if (selectedDate.toMillis() < currentDate.toMillis()) {
      ReactAlert.alert("Invalid Date", "start date cannot be in the past.");
      return;
    }

    // Check if the selected date is within 14 days from today
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to compare dates only

    const maximumDate = new Date(today);
    maximumDate.setDate(today.getDate() + 14); // Add 14 days to today

    const selectedDateObj = new Date(date);
    selectedDateObj.setHours(0, 0, 0, 0); // Reset hours to compare dates only

    if (selectedDateObj > maximumDate) {
      ReactAlert.alert(
        "Invalid Date",
        "Start date must be within 14 days from today."
      );
      return;
    }

    // Check for conflict with existing apartment bookings
    const startDate = new Date(date);
    const leaseDuration = bookingData.leaseDuration || 0;
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + leaseDuration);

    // Flatten all booked dates from the apartment
    const apartmentBookedDates = apartment.bookedDates
      .map((bd: any) => bd.bookedDates as Timestamp[])
      .flat();

    // Check if any date in the selected range is already booked
    let currentCheckDate = new Date(startDate);
    while (currentCheckDate <= endDate) {
      const checkTimestamp = Timestamp.fromDate(new Date(currentCheckDate));
      const isBooked = apartmentBookedDates.some(
        (bookedDate: any) =>
          checkTimestamp.toDate().setHours(0, 0, 0, 0) ===
          bookedDate.toDate().setHours(0, 0, 0, 0)
      );

      if (isBooked) {
        ReactAlert.alert(
          "Booking Conflict",
          "Some dates in your selected range are already booked. Please select a different date range."
        );
        return;
      }

      currentCheckDate.setDate(currentCheckDate.getDate() + 1);
    }

    setBookingData((prevData) => {
      const startDate = new Date(date);
      const leaseDuration = prevData.leaseDuration || 0; // Default to 0 if undefined

      // Compute end date by adding months
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + leaseDuration);

      const bookedDates: Timestamp[] = [];
      let currentDate = new Date(startDate);

      // Add all dates between startDate and endDate
      while (currentDate <= endDate) {
        bookedDates.push(Timestamp.fromDate(new Date(currentDate)));
        currentDate.setDate(currentDate.getDate() + 1); // Move to next day
      }

      return {
        ...prevData,
        bookedDate: bookedDates,
      };
    });

    setLeaseDateModalVisible(false); // Close the popup
  };

  const handleBookApartment = async () => {
    try {
      let updatedBookingData = { ...bookingData };
      const booking = await createBooking(updatedBookingData); // Use updated data
      router.replace("/(Authenticated)/(tabs)/Home");
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  return (
    <View style={styles.container}>
      <>
        {/* Lease Duration Section */}
        <View style={styles.editables}>
          <Text>Lease Duration</Text>
          <Text
            style={styles.editablesText}
            onPress={() => setDurationModalVisible(true)}
          >
            Edit
          </Text>
        </View>
        {bookingData.leaseDuration > 0 && (
          <>
            <DurationCard duration={bookingData.leaseDuration} />
          </>
        )}
        <DurationPopup
          visible={durationModalVisible}
          onSelect={handleSelectDuration}
          message="Select Lease Duration"
          leaseDuration={apartment.leaseTerms}
        />
      </>

      {bookingData.leaseDuration > 0 && (
        <>
          {/* Lease Duration Section */}
          <View style={styles.editables}>
            <Text>Lease Date</Text>
            <Text
              style={styles.editablesText}
              onPress={() => setLeaseDateModalVisible(true)}
            >
              Edit
            </Text>
          </View>
        </>
      )}

      {bookingData.bookedDate.length > 0 && (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <DateCard date={bookingData.bookedDate[0]} />
          <Ionicons
            name="chevron-forward"
            size={24}
            color="black"
            style={{ marginHorizontal: 20 }}
          />
          <DateCard
            date={bookingData.bookedDate[bookingData.bookedDate.length - 1]}
          />
        </View>
      )}
      <DateSelectPopup
        visible={leaseDateModalVisible}
        onSelect={handleSelectStartDate}
        viewingDates={apartment.viewingDates.map(
          (bd: any) => bd.viewingDate as Timestamp
        )}
        onClose={() => setLeaseDateModalVisible(false)}
        bookedDates={apartment.bookedDates
          .map((bd: any) => bd.bookedDates as Timestamp[])
          .flat()}
        title="Select Lease Date"
        subtitle="Select the start date of the lease"
      />

      <CustomButton
        title="Confirm"
        onPress={handleBookApartment}
        disabled={bookingData.leaseDuration === 0}
        style={{ marginTop: 20, marginBottom: 20 }}
      />
    </View>
  );
};

export default ApartmentComponent;

const styles = StyleSheet.create({
  container: {
    marginTop: -60,
    height: "50%",
  },
  editables: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  editablesText: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
});
