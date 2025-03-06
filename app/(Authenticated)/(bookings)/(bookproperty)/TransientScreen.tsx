import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
  Alert as ReactAlert,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import Apartment from "@/app/types/Apartment";
import PropertyCard from "@/app/components/BookingComponents/PropertyCard";
import IconButton from "@/app/components/IconButton";
import Colors from "@/assets/styles/colors";
import TenantCard from "@/app/components/BookingComponents/TenantCard";
import UserData from "@/app/types/UserData";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import Tenant from "@/app/types/Tenant";
import DurationCard from "@/app/components/BookingComponents/DurationCard";
import DateCard from "@/app/components/BookingComponents/DateCard";
import DurationPopup from "@/app/components/BookingComponents/DurationPopup";
import Booking from "@/app/types/Booking";
import TenantPopup from "@/app/components/BookingComponents/TenantPopup";
import { Ionicons } from "@expo/vector-icons";
import DateSelectPopup from "@/app/components/BookingComponents/DateSelectPopup";
import { serverTimestamp, Timestamp } from "firebase/firestore";
import CustomButton from "@/app/components/CustomButton";
import {
  createBooking,
  createAlert,
} from "@/app/Firebase/Services/DatabaseService";
import { router } from "expo-router";
import Alert from "@/app/types/Alert";
import Transient from "@/app/types/Transient";
import TransientDateSelect from "@/app/components/BookingComponents/TransientDateSelect";

interface ApartmentProps {
  transient: Transient;
}

const TransientScreen: React.FC<ApartmentProps> = ({ transient }) => {
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [leaseDateModalVisible, setLeaseDateModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState<Booking>({
    id: "",
    type: "Transient",
    propertyId: transient.id || "",
    status: "Booked",
    bookedDate: [],
    leaseDuration: 0,
    tenants: [], // Ensure it's an array initially
    createdAt: serverTimestamp(),
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getStoredUserData();
        if (userData) {
          setCurrentUserData(userData);

          // Ensure `tenants` is an array
          setBookingData((prevData) => {
            const updatedData = {
              ...prevData,
              tenants: [{ user: userData, status: "Host" as const }], // Ensure it's an array
            };
            console.log("Updated data:", updatedData); // Logs the correct updated state
            return updatedData;
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchCurrentUser();
  }, []); // No need to add dependencies since fetchCurrentUser is declared inside

  const handleSelectDate = (dates: Timestamp[]) => {
    setBookingData((prevData) => {
      const updatedData = { ...prevData, bookedDate: dates, leaseDuration: dates.length - 1 };
      console.log("Updated data:", updatedData); // Logs the correct updated state
      return updatedData;
    });
    setLeaseDateModalVisible(false); // Close the popup
  };

  const handleBookTransient = async () => {
    try {
      let updatedBookingData = { ...bookingData };

      const booking = await createBooking(updatedBookingData); // Use updated data

      if (booking) {
        const alertData: Alert = {
          message: "Wants to book your transient.",
          type: "Booking",
          bookingType: "Transient",
          bookingId: booking,
          createdAt: serverTimestamp(),
          propertyId: transient.id || "",
          isRead: false,
          sender: updatedBookingData.tenants[0].user,
          receiver: transient.owner as UserData,
        };

        await createAlert(alertData);
        router.replace("/(Authenticated)/(tabs)/Home");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  useEffect(() => {
    console.log(bookingData)
  }, [bookingData]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <PropertyCard
          image={transient.images[0]}
          isApartment={false}
          title={transient.title}
          status={transient.status}
          bedRooms={transient.bedRooms}
          bathRooms={transient.bathRooms}
          livingRooms={transient.livingRooms}
          kitchen={transient.kitchen}
          pax={transient.maxGuests}
        />
        <View style={styles.line} />

        <Text style={styles.title}>Booking Details</Text>

        {/* Tenant Section */}
        <Text style={styles.subtitle}>Tenant</Text>
        {bookingData.tenants.map((tenant) => (
          <TenantCard key={tenant.user.id} tenant={tenant} />
        ))}

        {/* Lease Date Section */}
        <View style={styles.row}>
          <Text style={styles.subtitle}>Date</Text>
          <TouchableOpacity onPress={() => setLeaseDateModalVisible(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
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
        <TransientDateSelect
          visible={leaseDateModalVisible}
          onClose={() => setLeaseDateModalVisible(false)}
          bookedDates={transient.bookedDates}
          title="Select Dates"
          subtitle="Select Dates for renting"
          onConfirm={handleSelectDate}
        />

        <View style={styles.line} />

        {/* Price Section */}
        <Text style={styles.subtitle}>Price</Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 10,
          }}
        >
          <Text style={styles.description}>{`Transient Price x ${bookingData.leaseDuration} nights`}</Text>
          <Text style={styles.description}>
            {`${new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(transient.price * bookingData.leaseDuration)}`}
          </Text>
        </View>
        <View style={styles.line} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingRight: 10,
          }}
        >
          <Text style={styles.description}>Grand Total</Text>
          <Text style={styles.description}>
            {`${new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(transient.price * bookingData.leaseDuration)}`}
          </Text>
        </View>
        <CustomButton
          title={"Book Apartment"}
          onPress={handleBookTransient}
          style={styles.bookButton}
          disabled={
            !bookingData.leaseDuration || // Lease duration must be set
            bookingData.bookedDate?.length === 0 ||
            !bookingData.bookedDate // Must have at least one booked date
          }
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 15,
  },
  title: { fontSize: 15, fontWeight: "bold" },
  subtitle: { fontSize: 13, fontWeight: "600", marginLeft: 10 },
  description: { fontSize: 12, marginLeft: 20 },
  inviteButton: { marginTop: 10, borderColor: Colors.primary, borderWidth: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  editText: { color: Colors.primary, fontWeight: "bold" },
  bookButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
  },
});

export default TransientScreen;
