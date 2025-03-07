import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Message from "@/app/types/Message";
import Colors from "@/assets/styles/colors";
import { formatDistanceToNow } from "date-fns";

interface SenderBubbleProps {
  message: Message;
}

const SenderBubble: React.FC<SenderBubbleProps> = ({ message }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "flex-end",
      }}
    >
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
      <Image source={{ uri: message.sender.photoUrl }} style={styles.avatar} />
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 20,
    borderEndEndRadius: 0,
    marginBottom: 10,
    maxWidth: "50%"
  },
  message: {
    color: "white",
    fontSize: 16,
  },
  timestamp: {
    color: "white",
    fontSize: 10,
    alignSelf: "flex-end",
    marginTop: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "blue",
    marginLeft: 5,
  },
});

export default SenderBubble;
