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
import {
  createAlert,
  createConversation,
  fetchUserDataFromFirestore,
  updateApartment,
  updateBooking,
} from "@/app/Firebase/Services/DatabaseService";
import { router } from "expo-router";
import useSendAlerts from "@/app/hooks/alerts/useSendAlerts";
import Alert from "@/app/types/Alert";
import Tenant from "@/app/types/Tenant";
import EvictionPopup from "@/app/components/BookingComponents/EvictionPopup";
import { checkExistingConversationWithTenants } from "@/app/hooks/inbox/useCheckExistingConversationWithTenants";
import useBatchDeclineBooking from "@/app/hooks/bookings/useBatchDeclineBooking";
import ReasonPopup from "@/app/components/BookingComponents/ReasonPopup";
import getCurrentUserData from "@/app/hooks/users/getCurrentUserData";
import ArchiveDocument from "@/app/hooks/archives/ArchiveDocument";
import SetRestore from "@/app/hooks/archives/SetRestore";

interface ApartmentProps {
  apartment: Apartment;
  booking: Booking;
}

const ApartmentScreen: React.FC<ApartmentProps> = ({ apartment, booking }) => {
  const [currentUserData, setCurrentUserData] = useState<UserData>(
    {} as UserData
  );
  const [ownerData, setOwnerData] = useState<UserData>({} as UserData);
  const [tenantEvictionModalVisible, setTenantEvictionModalVisible] =
    useState<boolean>(false);
  const [ReasonPopupModalVisible, setReasonPopupModalVisible] =
    useState<boolean>(false);
  const [bookingData, setBookingData] = useState<Booking>({} as Booking);
  const [loading, setLoading] = useState<boolean>(true);
  const {
    sendAlerts,
    loading: sendAlertsLoading,
    error,
    success,
  } = useSendAlerts();

  const handleViewingApproval = async () => {
    try {
      setLoading(true);

      const existingConversation = await checkExistingConversationWithTenants(
        String(apartment.id),
        booking.tenants.map((tenant) => tenant.user.id as string),
        ownerData.id as string
      );

      const alertData: Alert = {
        message: "Your viewing appointment has been approved.",
        type: "Booking",
        bookingType: "Apartment",
        bookingId: String(booking.id),
        propertyId: String(apartment.id),
        isRead: false,
        senderId: currentUserData.id as string,
        createdAt: Timestamp.now(),
      };

      await updateApartment(String(apartment.id), {
        ...apartment,
        viewingDates: [
          ...apartment.viewingDates,
          {
            bookingId: String(booking.id),
            viewingDate: booking.viewingDate,
          },
        ],
        status: "Unavailable",
      });

      await sendAlerts(booking.tenants, alertData);

      if (!existingConversation) {
        const createdConversation = await createConversation({
          members: [
            ...booking.tenants.map((tenant) => ({
              user: tenant.user,
              count: 0,
            })),
            {
              user: currentUserData,
              count: 0,
            },
          ],
          propertyId: String(apartment.id),
          bookingId: String(booking.id),
          type: "Booking",
          lastMessage: "Started a conversation",
          lastSender: currentUserData,
        });
        setLoading(false);
        if (createdConversation) {
          await updateBooking(String(booking.id), {
            ...booking,
            status: "Viewing Confirmed",
            conversationId: createdConversation.id,
          });

          router.replace(
            `/(Authenticated)/(inbox)/(viewconversation)/${createdConversation?.id}`
          );
          return;
        }
      }

      await updateBooking(String(booking.id), {
        ...booking,
        status: "Viewing Confirmed",
        conversationId: existingConversation?.id,
      });

      await useBatchDeclineBooking(String(apartment.id), String(booking.id));

      router.replace(
        `/(Authenticated)/(inbox)/(viewconversation)/${existingConversation?.id}`
      );
    } catch (error) {
      console.error("Error approving viewing:", error);
    }
  };

  const handleBookingApproval = async () => {
    try {
      setLoading(true);

      await updateBooking(String(booking.id), {
        ...booking,
        status: "Booking Confirmed",
      });

      await updateApartment(String(apartment.id), {
        ...apartment,
        bookedDates: [
          ...apartment.bookedDates,
          {
            bookingId: String(booking.id),
            bookedDates: booking.bookedDate,
          },
        ],
        status: "Unavailable",
      });

      const alertData: Alert = {
        message: "Your booking has been approved.",
        type: "Booking", // Default value, change if needed
        bookingType: "Apartment",
        bookingId: String(booking.id),
        propertyId: String(apartment.id),
        isRead: false,
        senderId: currentUserData.id as string,
        createdAt: Timestamp.now(),
      };

      await sendAlerts(booking.tenants, alertData);

      await ArchiveDocument(
        "apartments",
        bookingData.propertyId as string,
        "unavailable"
      );
      setLoading(true);
      router.replace(`/(Authenticated)/(tabs)/Bookings`);
    } catch (error) {
      setLoading(true);
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

  const handleDecline = async (reason: string) => {
    await updateBooking(String(booking.id), {
      ...booking,
      status:
        currentUserData.role === "home owner"
          ? "Booking Declined"
          : "Booking Cancelled",
      reason: reason,
      reasonType: currentUserData.role === "home owner" ? "Decline" : "Cancel",
    });

    await updateApartment(String(apartment.id), {
      ...apartment,
      status: "Available",
      viewingDates: [],
      bookedDates: [],
    });

    let AlertData: Alert;

    if (currentUserData.role === "home owner") {
      AlertData = {
        message: "Your booking has been declined.",
        type: "Booking",
        bookingType: "Apartment",
        bookingId: String(booking.id),
        propertyId: String(apartment.id),
        isRead: false,
        senderId: currentUserData.id as string,
        createdAt: Timestamp.now(),
      };
    } else {
      AlertData = {
        message: "Cancelled the booking.",
        type: "Booking",
        bookingType: "Apartment",
        bookingId: String(booking.id),
        propertyId: String(apartment.id),
        isRead: false,
        senderId: currentUserData.id as string,
        receiverId: ownerData.id as string,
        createdAt: Timestamp.now(),
      };
    }

    if (currentUserData.role === "home owner") {
      await sendAlerts(booking.tenants, AlertData);
    } else {
      await createAlert(AlertData);
    }

    router.replace(`/(Authenticated)/(tabs)/Bookings`);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = (await getCurrentUserData()) as UserData;
        setCurrentUserData(userData);
        setBookingData(booking);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchOwnerData = async () => {
      try {
        const ownerData = await fetchUserDataFromFirestore(booking.owner);
        setOwnerData(ownerData as UserData);
      } catch (error) {
        console.error("Error fetching owner data:", error);
      }
    };

    fetchOwnerData();
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
    await SetRestore(bookingData.propertyId as string);

    setBookingData((prevData) => ({
      ...prevData,
      tenants: tenants,
    }));

    await updateBooking(String(booking.id), {
      ...booking,
      tenants: tenants,
      status: "Booking Completed",
    });

    setTenantEvictionModalVisible(false);
    router.replace("/(Authenticated)/(tabs)/Bookings");
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
        {booking.reason && (
          <Text
            style={[
              styles.title,
              {
                fontSize: 14,
                textAlign: "center",
                marginTop: 15,
                color: Colors.error,
                fontWeight: "regular",
              },
            ]}
          >
            Reason: {booking.reason}
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
          <TenantCard
            key={tenant.user.id}
            tenant={tenant}
            onPress={() => {
              router.push(
                `/(Authenticated)/(profile)/(viewprofile)/${tenant.user.id}`
              );
            }}
          />
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
                onPress={() => {
                  setReasonPopupModalVisible(true);
                }}
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
                onPress={() => {
                  setReasonPopupModalVisible(true);
                }}
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
          bookingId={booking.id}
          apartmentId={apartment.id}
          currentUserId={currentUserData.id}
        />

        <ReasonPopup
          visible={ReasonPopupModalVisible}
          onClose={() => {
            setReasonPopupModalVisible(false);
          }}
          onSubmit={(reason) => {
            handleDecline(reason);
            setReasonPopupModalVisible(false);
          }}
        />

        {/* Actions - Tenants */}
        {booking.status !== "Viewing Confirmed" &&
          booking.status !== "Booking Declined" &&
          booking.status !== "Booking Cancelled" &&
          booking.status !== "Booking Confirmed" &&
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
                onPress={() => {
                  setReasonPopupModalVisible(true);
                }}
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
