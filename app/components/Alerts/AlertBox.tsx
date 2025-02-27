import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { UserData } from "@/app/types/UserData";
import IconButton from "../IconButton";
import Colors from "@/assets/styles/colors";

interface AlertBoxProps {
  sender: UserData;
  message: string;
  isInquiry: boolean;
  isRead: boolean;
  createdAt: number;
}

const AlertBox: React.FC<AlertBoxProps> = ({
  sender,
  message,
  isInquiry,
  isRead,
  createdAt,
}) => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row" }}>
          <Image source={{ uri: sender.photoUrl }} style={styles.avatar} />
          <View style={{ marginLeft: 15 }}>
            <Text
              style={styles.senderName}
            >{`${sender.firstName} ${sender.lastName}`}</Text>
            <Text style={styles.senderDisplayName}>
              @{sender.displayName}
            </Text>
            <Text>{message}</Text>
          </View>
        </View>
        <View style={isRead ? { display: "none" } : styles.unreadIndication} />
      </View>

      {/* Actions Section */}
      <View>
        {isInquiry && (
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

        <Text style={{ fontSize: 12, color: Colors.secondaryText, alignSelf: "flex-end" }}>
          {new Date(createdAt).toLocaleString()}
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
