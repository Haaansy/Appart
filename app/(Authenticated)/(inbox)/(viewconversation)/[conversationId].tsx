import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import useConversation from "@/app/hooks/inbox/useConversation";
import MessageInput from "@/app/components/InboxComponents/MessageInput";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import useFetchMessages from "@/app/hooks/inbox/useFetchMessages";
import SenderBubble from "@/app/components/InboxComponents/SenderBubble";
import useSendMessage from "@/app/hooks/inbox/useSendMessage";
import ReceiverBubble from "@/app/components/InboxComponents/ReceiverBubble";
import UserData from "@/app/types/UserData";
import ConversationPopup from "@/app/components/InboxComponents/ConversationPopup";
import Conversation from "@/app/types/Conversation";

const index = () => {
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const { conversationId } = useLocalSearchParams();
  const [conversationModalVisible, setConversationModalVisible] =
    useState(false);

  const {
    conversation,
    loading: conversationLoading,
    error: conversationError,
  } = useConversation(String(conversationId));

  const {
    messages,
    loading: messagesLoading,
    error: messageError,
  } = useFetchMessages(String(conversationId));

  const [message, setMessage] = useState("");
  const { sendMessage, loading } = useSendMessage(
    String(conversationId),
    currentUserData
  );

  useEffect(() => {
    console.log(
      "[DEBUG] Retrieved conversation ID in viewconversation page:",
      conversationId
    );
  }, [conversationId]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        if (userData) {
          setCurrentUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSend = async () => {
    await sendMessage(message);
    setMessage(""); // Clear input after sending
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={Colors.primaryText}
            />
          </TouchableOpacity>
          <View style={{ flexDirection: "row", marginLeft: 15 }}>
            {conversation?.members.map((member) => (
              <Image
                key={member.user.id}
                source={{ uri: member.user.photoUrl }}
                style={styles.membersAvatar}
              />
            ))}
          </View>
          <View style={{ flexDirection: "row", marginLeft: 5, flex: 1 }}>
            {conversation &&
              conversation?.members.length < 4 &&
              conversation.members.map((member, index) => (
                <Text key={member.user.id}>{`${member.user.displayName}${
                  index < conversation.members.length - 1 ? ", " : " "
                }`}</Text>
              ))}

            {conversation && conversation.members.length >= 4 && (
              <Text>
                {`${conversation.members[0].user.displayName}, ${
                  conversation.members[1].user.displayName
                }, ${conversation.members.length - 2} more`}
              </Text>
            )}

            {conversation?.members && conversation.members.length >= 5 && (
              <Text>{`${conversation.members[0].user.displayName} and ${
                conversation.members.length - 1
              } others`}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => setConversationModalVisible(true)}>
            <Ionicons
              name="ellipsis-vertical"
              size={24}
              color={Colors.primaryText}
            />
          </TouchableOpacity>
        </View>

        {/* Conversation Dropdown Menu */}
        <ConversationPopup
          onSelect={() => setConversationModalVisible(false)}
          visible={conversationModalVisible}
          onClose={() => setConversationModalVisible(false)}
          bookingId={conversation?.bookingId as string}
          conversation={conversation as Conversation}
        />

        {/* Messages List */}
        <View style={styles.messagesContainer}>
          {!messagesLoading ? (
            <FlatList
              data={[...messages].reverse()} // Reverse messages without mutating original array
              keyExtractor={(item, index) => item.id ?? index.toString()}
              renderItem={({ item }) =>
                item.sender.id === currentUserData?.id ? (
                  <SenderBubble message={item} />
                ) : (
                  <ReceiverBubble message={item} />
                )
              }
              inverted
              contentContainerStyle={{ paddingBottom: 10 }} // Prevents messages from sticking to top
            />
          ) : (
            <Text>Loading...</Text>
          )}
          {!messagesLoading && messages.length === 0 && (
            <Text style={{ textAlign: "center" }}>
              {conversation?.lastSender.displayName} Started a conversation.{" "}
              {"\n"} Say hello!
            </Text>
          )}
        </View>

        {/* Message Input */}
        <View style={styles.inputContainer}>
          <MessageInput
            value={message}
            onChangeText={setMessage}
            onSend={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: Colors.primaryBackground,
    // marginTop: StatusBar.currentHeight removed to fix Android spacing
  },
  messagesContainer: {
    flex: 1, // Ensures FlatList takes up all available space
    paddingHorizontal: 25,
  },
  inputContainer: {
    padding: 10,
    backgroundColor: Colors.primaryBackground,
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
});

export default index;
