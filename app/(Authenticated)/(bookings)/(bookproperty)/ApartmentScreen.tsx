import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Apartment } from "@/app/types/Apartment";
import PropertyCard from "@/app/components/BookingComponents/PropertyCard";
import IconButton from "@/app/components/IconButton";
import Colors from "@/assets/styles/colors";
import TenantCard from "@/app/components/BookingComponents/TenantCard";
import { UserData } from "@/app/types/UserData";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import { Tenant } from "@/app/types/Tenant";
import DurationCard from "@/app/components/BookingComponents/DurationCard";
import DateCard from "@/app/components/BookingComponents/DateCard";
import DurationPopup from "@/app/components/BookingComponents/DurationPopup";
import { Booking } from "@/app/types/Booking";
import TenantPopup from "@/app/components/BookingComponents/TenantPopup";
import { Ionicons } from "@expo/vector-icons";
import DateSelectPopup from "@/app/components/BookingComponents/DateSelectPopup";
import { Timestamp } from "firebase/firestore";
import CustomButton from "@/app/components/CustomButton";
import {
  createBooking,
  createAlert,
} from "@/app/Firebase/Services/DatabaseService";
import { router } from "expo-router";
import { Alert } from "@/app/types/Alert";

interface ApartmentProps {
  apartment: Apartment;
}

const ApartmentScreen: React.FC<ApartmentProps> = ({ apartment }) => {
  const [durationModalVisible, setDurationModalVisible] = useState(false);
  const [tenantModalVisible, setTenantModalVisible] = useState(false);
  const [leaseDateModalVisible, setLeaseDateModalVisible] = useState(false);
  const [viewingDateModalVisible, setViewingDateModalVisible] = useState(false);
  const [bookingData, setBookingData] = useState<Booking>({
    id: "",
    isApartment: true,
    propertyId: apartment.id || "",
    status: "Booked",
    bookedDate: [],
    leaseDuration: 0,
    tenants: [], // Ensure it's an array initially
    viewingDate: Timestamp.fromMillis(Date.now()),
  });

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getStoredUserData();
        if (userData) {
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

  const handleInviteTenant = (tenants: Tenant[]) => {
    setBookingData((prevData) => {
      const updatedData = { ...prevData, tenants };
      return updatedData;
    });
    setTenantModalVisible(false); // Close the popup
  };

  const handleSelectStartDate = (date: number) => {
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

  const handleSelectViewingDate = (date: number) => {
    setBookingData((prevData) => {
      return { ...prevData, viewingDate: Timestamp.fromMillis(date) };
    });

    setViewingDateModalVisible(false); // Close the popup
  };

  const handleBookApartment = async () => {
    try {
      const booking = await createBooking(bookingData);
      if (booking) {
        console.log("Booking created successfully:", booking);

        const alertData: Alert = {
          message: "Want to book your apartment.",
          type: "booking",
          bookingType: "apartment",
          bookingId: booking,
          createdAt: new Date(),
          propertyId: apartment.id || "",
          isRead: false,
          sender: bookingData.tenants[0].user,
          receiver: apartment.owner as UserData,
        };

        const notification = await createAlert(alertData);

        if (notification) {
          console.log("Notification created successfully:", notification);

          // Redirect to booking details screen
          router.replace("/(Authenticated)/(tabs)/Home");
        }
      }
    } catch (error) {
      console.error("Error creating booking:", error);
    }
  };

  // Logs the updated state after it changes
  useEffect(() => {
    console.log("New bookingData:", bookingData);
  }, [bookingData]);

  return (
    <View style={styles.container}>
      <ScrollView>
        <PropertyCard
          image={apartment.images[0]}
          isApartment={true}
          title={apartment.title}
          status={apartment.status}
          bedRooms={apartment.bedRooms}
          bathRooms={apartment.bathRooms}
          livingRooms={apartment.livingRooms}
          kitchen={apartment.kitchen}
          pax={apartment.maxTenants}
          levels={apartment.levels}
          area={apartment.area}
        />
        <View style={styles.line} />

        <Text style={styles.title}>Booking Details</Text>

        {/* Tenant Section */}
        <Text style={styles.subtitle}>Tenant</Text>
        {apartment.maxTenants > 1 && (
          <>
            <Text style={styles.description}>
              *Invited tenants should accept the invitation before the booking
              gets forwarded to the owner.
            </Text>
            <IconButton
              icon="add"
              onPress={() => setTenantModalVisible(true)}
              style={styles.inviteButton}
              text="Invite Tenant"
            />
          </>
        )}
        <TenantPopup
          visible={tenantModalVisible}
          onConfirm={handleInviteTenant}
          tenant={bookingData.tenants}
          onClose={() => setTenantModalVisible(false)}
        />

        {bookingData.tenants.map((tenant) => (
          <TenantCard key={tenant.user.id} tenant={tenant} />
        ))}

        {/* Lease Duration Section */}
        <View style={styles.row}>
          <Text style={styles.subtitle}>Lease Duration</Text>
          <TouchableOpacity onPress={() => setDurationModalVisible(true)}>
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>
        {bookingData.leaseDuration > 0 && (
          <DurationCard duration={bookingData.leaseDuration} />
        )}

        <DurationPopup
          visible={durationModalVisible}
          onSelect={handleSelectDuration}
          message="Select Lease Duration"
          leaseDuration={apartment.leaseTerms}
        />

        {/* Lease Date Section */}
        {bookingData.leaseDuration > 0 && (
          <View style={styles.row}>
            <Text style={styles.subtitle}>Lease Date</Text>
            <TouchableOpacity onPress={() => setLeaseDateModalVisible(true)}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}
        {bookingData.bookedDate.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <DateCard date={bookingData.bookedDate[0]} />
            <Ionicons
              name="chevron-forward"
              size={24}
              color="black"
              style={{ marginHorizontal: 35 }}
            />
            <DateCard
              date={bookingData.bookedDate[bookingData.bookedDate.length - 1]}
            />
          </View>
        )}
        <DateSelectPopup
          visible={leaseDateModalVisible}
          onSelect={handleSelectStartDate}
          viewingDates={apartment.viewingDates}
          onClose={() => setLeaseDateModalVisible(false)}
          bookedDates={apartment.bookedDates}
          title="Select Lease Date"
          subtitle="Select the start date of the lease"
        />

        {/* Viewing Date Section */}
        {bookingData.bookedDate.length > 0 && (
          <>
            <View style={styles.row}>
              <Text style={styles.subtitle}>Viewing Appointment Date</Text>
              <TouchableOpacity
                onPress={() => setViewingDateModalVisible(true)}
              >
                <Text style={styles.editText}>Edit</Text>
              </TouchableOpacity>
            </View>
            <DateCard date={bookingData.viewingDate ?? Timestamp.now()} />
          </>
        )}

        <DateSelectPopup
          visible={viewingDateModalVisible}
          onSelect={handleSelectViewingDate}
          viewingDates={apartment.viewingDates}
          onClose={() => setViewingDateModalVisible(false)}
          bookedDates={apartment.bookedDates}
          title="Select Viewing Date"
          subtitle="Select the viewing appointment date"
          yourbookedDates={bookingData.bookedDate}
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
          <Text style={styles.description}>Apartment Lease Price</Text>
          <Text style={styles.description}>
            {`${new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(apartment.price)} ${
              bookingData.leaseDuration > 1 ? "/mo" : ""
            }`}
          </Text>
        </View>
        {apartment.securityDeposit > 0 && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              paddingRight: 10,
            }}
          >
            <Text style={styles.description}>Apartment Security Deposit</Text>
            <Text style={styles.description}>
              {`${new Intl.NumberFormat("en-PH", {
                style: "currency",
                currency: "PHP",
              }).format(apartment.securityDeposit)}`}
            </Text>
          </View>
        )}
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
            }).format(apartment.securityDeposit + apartment.price)}`}
          </Text>
        </View>
        <CustomButton
          title={"Book Apartment"}
          onPress={handleBookApartment}
          style={styles.bookButton}
          disabled={
            !bookingData.viewingDate || // Viewing date must be set
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

export default ApartmentScreen;
