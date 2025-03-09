import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import React, { useState } from "react";
import PropertyCard from "@/app/components/BookingComponents/PropertyCard";
import Colors from "@/assets/styles/colors";
import TenantCard from "@/app/components/BookingComponents/TenantCard";
import DateCard from "@/app/components/BookingComponents/DateCard";
import Booking from "@/app/types/Booking";
import { Ionicons } from "@expo/vector-icons";
import Transient from "@/app/types/Transient";
import IconButton from "@/app/components/IconButton";
import useSendAlerts from "@/app/hooks/alerts/useSendAlerts";
import {
  updateBooking,
  updateApartment,
  updateTransient,
  createConversation,
} from "@/app/Firebase/Services/DatabaseService";
import { router } from "expo-router";
import { Timestamp } from "firebase/firestore";
import UserData from "@/app/types/UserData";
import Alert from "@/app/types/Alert";
import { checkExistingConversationWithTenants } from "@/app/hooks/inbox/useCheckExistingConversationWithTenants";

interface TransientProps {
  transient: Transient;
  booking: Booking;
}

const TransientScreen: React.FC<TransientProps> = ({ transient, booking }) => {
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const {
    sendAlerts,
    loading: sendAlertsLoading,
    error,
    success,
  } = useSendAlerts();

  const handleBookingApproval = async () => {
    try {
      const existingConversation = await checkExistingConversationWithTenants(
        String(transient.id),
        booking.tenants.map((tenant) => tenant.user),
        transient.owner as UserData,
        currentUserData as UserData
      );

      const updatedData = await updateBooking(String(booking.id), {
        ...booking,
        status: "Booking Confirmed",
      });

      const alertData: Alert = {
        message: "Your viewing appointment has been approved.",
        type: "Booking", // Default value, change if needed
        bookingType: "Apartment",
        bookingId: String(booking.id),
        propertyId: String(transient.id),
        isRead: false,
        senderId: currentUserData?.id as string,
        createdAt: Timestamp.now(),
      };

      await sendAlerts(booking.tenants, alertData);

      if (!existingConversation) {
        const createdConversation = await createConversation({
          members: [
            ...booking.tenants.map((tenant) => ({
              user: tenant.user,
              count: 0,
            })),
            {
              user: currentUserData as UserData,
              count: 0,
            },
          ],
          propertyId: String(transient.id),
          bookingId: String(booking.id),
          type: "Booking",
          lastMessage: "Started a conversation",
          lastSender: currentUserData as UserData,
        });

        if(createdConversation) {
          router.push(
            `/(Authenticated)/(inbox)/(viewconversation)/${createdConversation}`
          );
          return;
        }
      }

      router.push(`/(Authenticated)/(inbox)/(viewconversation)/${existingConversation?.id}`)
    } catch (error) {
      console.error("Error approving viewing:", error);
    }
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
              Wants to book a transient.
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
        {booking.tenants.map((tenant) => (
          <TenantCard key={tenant.user.id} tenant={tenant} />
        ))}

        {/* Lease Date Section */}
        <View style={styles.row}>
          <Text style={styles.subtitle}>Date</Text>
        </View>
        {booking.bookedDate.length > 0 && (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <DateCard date={booking.bookedDate[0]} />
            <Ionicons
              name="chevron-forward"
              size={24}
              color="black"
              style={{ marginHorizontal: 20 }}
            />
            <DateCard
              date={booking.bookedDate[booking.bookedDate.length - 1]}
            />
          </View>
        )}

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
          <Text
            style={styles.description}
          >{`Transient Price x ${booking.leaseDuration} nights`}</Text>
          <Text style={styles.description}>
            {`${new Intl.NumberFormat("en-PH", {
              style: "currency",
              currency: "PHP",
            }).format(transient.price * booking.leaseDuration)}`}
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
            }).format(transient.price * booking.leaseDuration)}`}
          </Text>
        </View>
        {booking.status === "Booked" && (
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
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginVertical: 10,
  },
});

export default TransientScreen;
