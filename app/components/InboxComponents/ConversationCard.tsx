import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect, useState } from "react";
import Conversation from "@/app/types/Conversation";
import Colors from "@/assets/styles/colors";
import { formatDistanceToNow } from "date-fns";
import { Timestamp } from "firebase/firestore";
import UserData from "@/app/types/UserData";
import getCurrentUserData from "@/app/hooks/users/getCurrentUserData";

interface ConversationCardProps {
  conversation: Conversation;
}

const ConversationCard: React.FC<ConversationCardProps> = ({ conversation }) => {
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [relativeTime, setRelativeTime] = useState<string>("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUserData();
        if (userData) {
          setCurrentUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const updateRelativeTime = () => {
      if (conversation.updatedAt instanceof Timestamp) {
        setRelativeTime(
          formatDistanceToNow(conversation.updatedAt.toDate(), {
            addSuffix: true,
          })
        );
      } else {
        setRelativeTime("No timestamp");
      }
    };

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 60000);

    return () => clearInterval(interval);
  }, [conversation.updatedAt]);

  const currentUserMember = currentUserData
    ? conversation.members.find((member) => member.user.id === currentUserData.id)
    : null;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: "row" }}>
          {conversation.members.map((member) => (
            <Image
              key={member.user.id}
              source={{ uri: member.user.photoUrl }}
              style={styles.membersAvatar}
            />
          ))}
        </View>
        <View style={{ flexDirection: "row", marginLeft: 10, flex: 1 }}>
          {conversation.members.length < 4 && conversation.members.map((member, index) => (
            <Text key={member.user.id}>{`${member.user.displayName}${
              index < conversation.members.length - 1 ? ", " : " "
            }`}</Text>
          ))}

          {conversation.members.length >= 4 && (
            <Text>
              {`${conversation.members[0].user.displayName}, ${
                conversation.members[1].user.displayName
              }, ${conversation.members.length - 2} more`}
            </Text>
          )}
        </View>
        {/* ✅ Check if `currentUserMember` exists and has unread messages */}
        {currentUserMember && currentUserMember.count > 0 && (
          <View style={styles.unreadIndicator} />
        )}
      </View>
      <View style={{ marginTop: 15 }}>
        <Text>{`${conversation.lastSender.displayName}: ${conversation.lastMessage}`}</Text>
      </View>
      <View style={{ marginTop: 15, alignItems: "flex-end" }}>
        <Text style={{ color: Colors.primary}}>{relativeTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground,
    padding: 25,
    borderRadius: 15,
  },
  membersAvatar: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    marginLeft: -10,
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: Colors.primaryBackground,
  },
  unreadIndicator: {
    width: 15,
    height: 15,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
});

export default ConversationCard;
