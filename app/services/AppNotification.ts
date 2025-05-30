import { useEffect, useRef } from "react";
import { Notifier, Easing } from "react-native-notifier";
import getAlerts from "@/app/hooks/alerts/getAlerts";
import UserData from "@/app/types/UserData";
import { fetchUserDataFromFirestore } from "../Firebase/Services/DatabaseService";
import { router } from "expo-router";
import Colors from "@/assets/styles/colors";

type Props = {
  currentUserData: UserData;
};

const InAppNotificationListener = ({ currentUserData }: Props) => {
  const { alerts } = getAlerts(currentUserData.id as string);
  const lastAlertId = useRef<string | null>(null);

  const filteredAlerts = alerts.filter((alert) => !alert.isRead && alert.senderId !== "System Alert");

  useEffect(() => {
    if (filteredAlerts.length > 0) {
      const latestAlert = filteredAlerts[0];
      if (latestAlert.id !== lastAlertId.current) {
        const showNotification = async () => {
          let senderName = "Unknown User";
          try {
            const senderData = await fetchUserDataFromFirestore(latestAlert.senderId);
            if (senderData) {
              senderName = senderData.displayName || "Unknown User";
            }
          } catch (e) {
            // Optionally handle error
          }
          Notifier.showNotification({
            title: latestAlert.type,
            description: `${senderName} ${latestAlert.message}`,
            duration: 3000,
            showAnimationDuration: 800,
            showEasing: Easing.bounce,
            hideOnPress: true,
            componentProps: {
              imageSource: require("@/assets/images/Icons/Dark-Icon.png"),
              containerStyle: {
                backgroundColor: Colors.primary,
                padding: 10
              },
              titleStyle: {
                color: Colors.primaryBackground,
              },
              descriptionStyle: {
                color: Colors.primaryBackground,
              }
            },
            onPress: () => {
              if (latestAlert.type === "Booking") {
                if (latestAlert.bookingType === "Apartment") {
                  router.push(
                    `/(Authenticated)/(bookings)/(viewbooking)/${latestAlert.bookingId}?isApartment=true`
                  );
                } else {
                  router.push(
                    `/(Authenticated)/(bookings)/(viewbooking)/${latestAlert.bookingId}?isApartment=false`
                  );
                }
              }
              else if (latestAlert.type === "Inquiry") {
                // Navigate to the conversation screen
                router.push(
                  `/(Authenticated)/(tabs)/Inbox`
                )
              }
            }
          });
          lastAlertId.current = latestAlert.id as string;
        };
        showNotification();
      }
    }
  }, [alerts]);

  return null;
};

export default InAppNotificationListener;