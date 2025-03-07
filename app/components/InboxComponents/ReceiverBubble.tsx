import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Message from "@/app/types/Message";
import Colors from "@/assets/styles/colors";
import { formatDistanceToNow } from "date-fns";

interface ReceiverBubbleProps {
  message: Message;
}

const ReceiverBubble: React.FC<ReceiverBubbleProps> = ({ message }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end",
      }}
    >
      <Image source={{ uri: message.sender.photoUrl }} style={styles.avatar} />
      <View style={styles.bubble}>
        <Text style={styles.message}>{message.message}</Text>
        <Text style={styles.timestamp}>
          {message.createdAt
            ? formatDistanceToNow(message.createdAt.toDate(), {
                addSuffix: true,
              })
            : "Just now"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: Colors.secondaryBackground,
    padding: 15,
    borderRadius: 20,
    borderBottomLeftRadius: 0,
    marginBottom: 10,
    maxWidth: "50%",
    marginLeft: 5,
  },
  message: {
    color: Colors.primaryText,
    fontSize: 16,
  },
  timestamp: {
    color: Colors.primaryText,
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "blue",
  },
});

export default ReceiverBubble;
