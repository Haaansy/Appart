import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Apartment from "@/app/types/Apartment";
import PropertyCard from "@/app/components/BookingComponents/PropertyCard";
import Colors from "@/assets/styles/colors";
import TenantCard from "@/app/components/BookingComponents/TenantCard";
import DurationCard from "@/app/components/BookingComponents/DurationCard";
import DateCard from "@/app/components/BookingComponents/DateCard";
import { Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";
import Booking from "@/app/types/Booking";
import IconButton from "@/app/components/IconButton";
import UserData from "@/app/types/UserData";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import {
  updateApartment,
  updateBooking,
} from "@/app/Firebase/Services/DatabaseService";
import { router } from "expo-router";
import useSendAlerts from "@/app/hooks/alerts/useSendAlerts";
import Alert from "@/app/types/Alert";
import Tenant from "@/app/types/Tenant";
import EvictionPopup from "@/app/components/BookingComponents/EvictionPopup";

interface ApartmentProps {
  apartment: Apartment;
  booking: Booking;
}

const ApartmentScreen: React.FC<ApartmentProps> = ({ apartment, booking }) => {
  const [currentUserData, setCurrentUserData] = useState<UserData>(
    {} as UserData
  );
  const [tenantEvictionModalVisible, setTenantEvictionModalVisible] =
    useState<boolean>(false);
  const [ bookingData, setBookingData ] = useState<Booking>({} as Booking);
  const [loading, setLoading] = useState<boolean>(true);
  const {
    sendAlerts,
    loading: sendAlertsLoading,
    error,
    success,
  } = useSendAlerts();

  const handleViewingApproval = async () => {
    try {
      const updatedData = await updateBooking(String(booking.id), {
        ...booking,
        status: "Viewing Confirmed",
      });
      const alertData: Alert = {
        message: "Your viewing appointment has been approved.",
        type: "Booking", // Default value, change if needed
        bookingType: "Apartment",
        bookingId: String(booking.id),
        propertyId: String(apartment.id),
        isRead: false,
        sender: currentUserData,
        createdAt: Timestamp.now(),
      };

      await sendAlerts(booking.tenants, alertData);

      router.replace(`/(Authenticated)/(tabs)/Bookings`);
    } catch (error) {
      console.error("Error approving viewing:", error);
    }
  };

  const handleBookingApproval = async () => {
    try {
      const updatedData = await updateBooking(String(booking.id), {
        ...booking,
        status: "Booking Confirmed",
      });

      const updatedApartment = await updateApartment(String(apartment.id), {
        ...apartment,
        bookedDates: [...booking.bookedDate, ...(booking.viewingDate ? [booking.viewingDate] : [])],
      });

      const alertData: Alert = {
        message: "Your booking has been approved.",
        type: "Booking", // Default value, change if needed
        bookingType: "Apartment",
        bookingId: String(booking.id),
        propertyId: String(apartment.id),
        isRead: false,
        sender: currentUserData,
        createdAt: Timestamp.now(),
      };

      await sendAlerts(booking.tenants, alertData);

      router.replace(`/(Authenticated)/(tabs)/Bookings`);
    } catch (error) {
      console.error("Error approving viewing:", error);
    }
  };

  const handleInvitation = async (status: "Accepted" | "Declined") => {
    await updateBooking(String(booking.id), {
      ...booking,
      tenants: booking.tenants.map((tenant) =>
        tenant.user.id === currentUserData.id
          ? { ...tenant, status: status }
          : tenant
      ),
    });

    router.replace(`/(Authenticated)/(tabs)/Bookings`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        setCurrentUserData(userData);
        setBookingData(booking);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleEviction = async (tenants: Tenant[]) => {
    setBookingData((prevData) => {
      const updatedData = {
        ...prevData,
        tenants: tenants, // Ensure it's an array
      };
      return updatedData;
    });

    const updatedBooking = await updateBooking(String(booking.id), {
      ...booking,
      tenants: tenants,
    });

    setTenantEvictionModalVisible(false);
    router.replace("/(Authenticated)/(tabs)/Bookings");
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: booking.tenants[0].user.photoUrl }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 10 }}>
            <Text
              style={[styles.title, { fontWeight: "regular" }]}
            >{`@${booking.tenants[0].user.displayName}`}</Text>
            <Text
              style={[styles.title, { fontWeight: "regular", fontSize: 12 }]}
            >
              Wants to book an apartment.
            </Text>
          </View>
        </View>
        {booking.status === "Booked" ? (
          <Text
            style={[
              styles.title,
              { fontSize: 16, textAlign: "center", marginTop: 15 },
            ]}
          >
            Waiting for Owner's Approval
          </Text>
        ) : (
          <Text
            style={[
              styles.title,
              { fontSize: 16, textAlign: "center", marginTop: 15 },
            ]}
          >
            {booking.status}
          </Text>
        )}
        <View style={styles.line} />
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
        {booking.tenants.map((tenant: Tenant) => (
          <TenantCard key={tenant.user.id} tenant={tenant} />
        ))}

        {/* Lease Duration Section */}
        <Text style={styles.subtitle}>Lease Duration</Text>
        <DurationCard duration={booking.leaseDuration} />

        {/* Lease Date Section */}
        <Text style={styles.subtitle}>Lease Date</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <DateCard date={booking.bookedDate[0]} />
          <Ionicons
            name="chevron-forward"
            size={24}
            color="black"
            style={{ marginHorizontal: 35 }}
          />
          <DateCard date={booking.bookedDate[booking.bookedDate.length - 1]} />
        </View>

        {/* Viewing Date Section */}
        <View style={styles.row}>
          <Text style={styles.subtitle}>Viewing Appointment Date</Text>
        </View>
        <DateCard date={booking.viewingDate ?? Timestamp.now()} />

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
              booking.leaseDuration > 1 ? "/mo" : ""
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

        {/* Actions - Owners*/}
        {booking.status === "Booked" &&
          currentUserData.role === "home owner" && (
            <View>
              <Text style={[styles.subtitle, { marginTop: 20 }]}>
                Viewing Approval
              </Text>
              <IconButton
                onPress={handleViewingApproval}
                icon="eye"
                text="Approve Viewing"
                iconColor={Colors.primaryBackground}
                textStyle={{ color: Colors.primaryBackground }}
                style={{
                  backgroundColor: Colors.primary,
                  borderWidth: 0,
                  marginTop: 5,
                }}
              />
              <IconButton
                onPress={() => {}}
                icon="close"
                text="Decline Booking"
                iconColor={Colors.primaryBackground}
                textStyle={{ color: Colors.primaryBackground }}
                style={{
                  backgroundColor: Colors.error,
                  borderWidth: 0,
                  marginTop: 5,
                }}
              />
            </View>
          )}

        {booking.status === "Viewing Confirmed" &&
          currentUserData.role === "home owner" && (
            <View>
              <Text style={[styles.subtitle, { marginTop: 20 }]}>
                Booking Approval
              </Text>
              <IconButton
                onPress={handleBookingApproval}
                icon="book"
                text="Approve Booking"
                iconColor={Colors.primaryBackground}
                textStyle={{ color: Colors.primaryBackground }}
                style={{
                  backgroundColor: Colors.primary,
                  borderWidth: 0,
                  marginTop: 5,
                }}
              />
              <IconButton
                onPress={() => {}}
                icon="close"
                text="Decline Booking"
                iconColor={Colors.primaryBackground}
                textStyle={{ color: Colors.primaryBackground }}
                style={{
                  backgroundColor: Colors.error,
                  borderWidth: 0,
                  marginTop: 5,
                }}
              />
            </View>
          )}

        {booking.status === "Booking Confirmed" &&
          currentUserData.role === "home owner" && (
            <View>
              <Text style={[styles.subtitle, { marginTop: 20 }]}>
                Tenant Management
              </Text>
              <IconButton
                onPress={() => setTenantEvictionModalVisible(true)}
                icon="person"
                text="Evict Tenant"
                iconColor={Colors.primaryBackground}
                textStyle={{ color: Colors.primaryBackground }}
                style={{
                  backgroundColor: Colors.error,
                  borderWidth: 0,
                  marginTop: 5,
                }}
              />
            </View>
          )}

        <EvictionPopup
          visible={tenantEvictionModalVisible}
          onConfirm={handleEviction}
          tenant={booking.tenants}
          onClose={() => setTenantEvictionModalVisible(false)}
        />

        {/* Actions - Tenants */}
        {booking.status !== "Viewing Confirmed" &&
          currentUserData.role === "tenant" &&
          booking.tenants?.some(
            (tenant: Tenant) =>
              tenant.user.id === currentUserData.id && tenant.status === "Host"
          ) && (
            <View>
              <Text style={[styles.subtitle, { marginTop: 20 }]}>
                Booking Actions
              </Text>
              <IconButton
                onPress={() => {}}
                icon="close"
                text="Cancel Booking"
                iconColor={Colors.primaryBackground}
                textStyle={{ color: Colors.primaryBackground }}
                style={{
                  backgroundColor: Colors.primary,
                  borderWidth: 0,
                  marginTop: 5,
                }}
              />
            </View>
          )}

        {/* Actions - Tenants(Invited) */}
        {booking.status == "Pending Invitation" &&
          currentUserData.role === "tenant" &&
          booking.tenants?.some(
            (tenant: Tenant) =>
              tenant.user.id === currentUserData.id &&
              tenant.status === "Invited"
          ) && (
            <View>
              <Text style={[styles.subtitle, { marginTop: 20 }]}>
                Booking Actions
              </Text>
              <IconButton
                onPress={() => handleInvitation("Accepted")}
                icon="checkmark"
                text="Accept Invitation"
                iconColor={Colors.primaryBackground}
                textStyle={{ color: Colors.primaryBackground }}
                style={{
                  backgroundColor: Colors.primary,
                  borderWidth: 0,
                  marginTop: 5,
                }}
              />
              <IconButton
                onPress={() => handleInvitation("Declined")}
                icon="close"
                text="Decline Invitation"
                iconColor={Colors.primaryBackground}
                textStyle={{ color: Colors.primaryBackground }}
                style={{
                  backgroundColor: Colors.error,
                  borderWidth: 0,
                  marginTop: 5,
                }}
              />
            </View>
          )}
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
  subtitle: { fontSize: 13, fontWeight: "600", marginLeft: 10, marginTop: 10 },
  description: { fontSize: 12, marginLeft: 20 },
  inviteButton: { marginTop: 10, borderColor: Colors.primary, borderWidth: 1 },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  editText: { color: Colors.primary, fontWeight: "bold" },
  bookButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginVertical: 10,
  },
});

export default ApartmentScreen;
