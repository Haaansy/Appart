import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import IconButton from "../IconButton";
import Colors from "@/assets/styles/colors";
import { Timestamp } from "firebase/firestore";
import Alert from "@/app/types/Alert";
import UserData from "@/app/types/UserData";
import { fetchUserDataFromFirestore } from "@/app/Firebase/Services/DatabaseService";

interface AlertBoxProps {
  alert: Alert;
}

const AlertBox: React.FC<AlertBoxProps> = ({ alert }) => {
  const [ senderData, setSenderData ] = useState<UserData | null>(null);

  useEffect(() => {
    try {
      const fetchSenderData = async () => {
        const fetchedSenderData = await fetchUserDataFromFirestore(alert.senderId);

        if(fetchedSenderData) {
          setSenderData(fetchedSenderData);
        }
      }

      fetchSenderData();
    } catch (error) {
      console.error("Error fetching sender data: ", error);
    }
  }, []);

  const formattedDate = (createdAt?: Timestamp | Date) => {
    if (!createdAt) return "N/A"; // Handle undefined case

    const date =
      createdAt instanceof Timestamp ? createdAt.toDate() : createdAt;

    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <Image
            source={{
              uri:
                senderData?.photoUrl ||
                "https://example.com/default-avatar.png",
            }}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 15 }}>
            <Text style={styles.senderName}>
              {alert.senderId
                ? `${senderData?.firstName} ${senderData?.lastName}`
                : "Unknown Sender"}
            </Text>
            <Text style={styles.senderDisplayName}>
              {alert.senderId ? `@${senderData?.displayName}` : "@unknown"}
            </Text>
            <Text style={{ width: "70%" }}>{alert.message}</Text>
          </View>
        </View>
        <View
          style={alert.isRead ? { display: "none" } : styles.unreadIndication}
        />
      </View>

      {/* Actions Section */}
      <View>
        {alert.type == "Inquiry" && (
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <IconButton
              icon={"checkmark-outline"}
              onPress={() => {}}
              text="Accept"
              iconColor={Colors.success}
              style={styles.buttons}
              textStyle={styles.buttonText}
            />
            <IconButton
              icon={"close-outline"}
              onPress={() => {}}
              text="Decline"
              iconColor={Colors.error}
              style={styles.buttons}
              textStyle={styles.buttonText}
            />
          </View>
        )}

        <Text style={{ alignSelf: "flex-end", marginTop: 5 }}>
          {formattedDate(alert.createdAt as Timestamp)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: 25,
    paddingVertical: 15,
    borderRadius: 15,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.primary,
  },
  senderName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primaryText,
  },
  senderDisplayName: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  unreadIndication: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  buttons: {
    borderWidth: 0,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primaryText,
  },
});

export default AlertBox;
