import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import useFetchConversations from "@/app/hooks/inbox/useFetchConversation";
import UserData from "@/app/types/UserData";
import ConversationCard from "@/app/components/InboxComponents/ConversationCard";
import { router } from "expo-router";
import useHandleConversationPress from "@/app/hooks/inbox/useHandleConversationPress";

const Inbox = () => {
  const insets = useSafeAreaInsets();
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const { handleConversationPress } = useHandleConversationPress(currentUserData);

  // Fetch user data first
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        if (userData) {
          setCurrentUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch conversations only after user data is available
  const { conversations, loading, error } = useFetchConversations(
    currentUserData as UserData
  );

  if (isLoading || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={styles.backgroundVector}
      />
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.topBar}>
          <Image
            source={require("@/assets/images/Icons/Dark-Icon.png")}
            style={styles.icon}
          />
          <View style={{ flexDirection: "column", marginLeft: 15 }}>
            <Text style={styles.greetings}>
              Hey, {currentUserData?.displayName || "Guest"}!
            </Text>
            <Text style={styles.subtext}>Some people want to message you.</Text>
          </View>
        </View>
        <View style={{ flex: 1, marginTop: 20 }}>
          {/* Inbox content */}
          {error ? (
            <Text style={{ color: "red" }}>{error}</Text>
          ) : (
            conversations.map((conversation) => (
              <TouchableOpacity key={conversation.id} style={{ marginVertical: 5}} onPress={()=>handleConversationPress(conversation)}>
                <ConversationCard conversation={conversation} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVector: {
    height: "90%",
    width: "100%",
    resizeMode: "stretch",
    position: "absolute",
    top: -350,
    backgroundColor: Colors.secondaryBackground,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  greetings: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryBackground,
  },
  subtext: {
    fontSize: 12,
    fontWeight: "regular",
    color: Colors.primaryBackground,
  },
  topBar: {
    flexDirection: "row",
    marginTop: 65,
    alignItems: "center",
  },
  form: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
});

export default Inbox;
