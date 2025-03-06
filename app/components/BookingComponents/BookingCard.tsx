import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
import Booking from "@/app/types/Booking";
import Colors from "@/assets/styles/colors";
import { useApartment } from "@/app/hooks/apartment/useApartment";
import { useTransient } from "@/app/hooks/transient/useTransient";
import { Ionicons } from "@expo/vector-icons";
import { Timestamp } from "firebase/firestore";

interface BookingCardProps {
  booking: Booking;
}

const BookingCard: React.FC<BookingCardProps> = ({ booking }) => {
  const {
    apartment,
    loading: apartmentLoading,
    error: apartmentError,
  } = booking.type === "Apartment"
    ? useApartment(booking.propertyId)
    : { apartment: null, loading: false, error: null };

  const {
    transient,
    loading: transientLoading,
    error: transientError,
  } = booking.type !== "Apartment"
    ? useTransient(booking.propertyId)
    : { transient: null, loading: false, error: null };

  if (apartmentLoading || transientLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        {booking.type === "Apartment" ? (
          <Image
            source={{ uri: apartment.images[0] }}
            style={styles.propertyImage}
          />
        ) : (
          <Image
            source={{ uri: transient.images[0] }}
            style={styles.propertyImage}
          />
        )}
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.propertyTitle}>
              {" "}
              {booking.type === "Apartment"
                ? apartment.title
                : transient.title}{" "}
            </Text>
            <Text style={styles.bookingDate}>
              {booking.createdAt instanceof Timestamp
                ? booking.createdAt.toDate().toLocaleDateString()
                : "Unknown Date"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginLeft: 20,
              marginTop: 5,
            }}
          >
            <Ionicons name="location" size={16} color={Colors.primary} />
            <Text style={styles.propertyAddress}>
              {" "}
              {booking.type === "Apartment"
                ? apartment.address
                : transient.address}{" "}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flex: 1,
            }}
          >
            <Text style={styles.bookerText}>
              @{booking.tenants[0].user.displayName}
            </Text>
            <Text style={styles.bookingDate}> View more details</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground,
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
  },
  propertyImage: {
    height: 100,
    width: 100,
    borderRadius: 5,
  },
  propertyTitle: {
    marginLeft: 20,
    fontSize: 14,
    fontWeight: "bold",
  },
  bookingDate: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "bold",
  },
  propertyAddress: {
    fontSize: 12,
    color: Colors.primaryText,
  },
  bookerText: {
    fontSize: 13,
    fontWeight: "semibold",
    color: Colors.primary,
    marginLeft: 20,
  },
});

export default BookingCard;
