import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Colors from "@/assets/styles/colors";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import useFetchConversations from "@/app/hooks/inbox/useFetchConversation";
import UserData from "@/app/types/UserData";
import ConversationCard from "@/app/components/InboxComponents/ConversationCard";
import useHandleConversationPress from "@/app/hooks/inbox/useHandleConversationPress";
import Conversation from "@/app/types/Conversation";
import { FlatList } from "react-native-gesture-handler";

interface InboxProps {
  conversations: Conversation[];
  loading: boolean;
  currentUserData: UserData;
}

const Inbox: React.FC<InboxProps> = ({
  conversations,
  loading,
  currentUserData,
}) => {
  const { handleConversationPress } =
    useHandleConversationPress(currentUserData);

  if (loading) {
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
      <View style={[styles.container]}>
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
          <FlatList
          contentContainerStyle={{ paddingBottom: 100, flexGrow: 1, marginTop: 20 }}
            data={conversations}
            keyExtractor={(item) => item.id as string}
            ListEmptyComponent={
              <View style={{ alignItems: "center", justifyContent: "center", backgroundColor: Colors.primaryBackground, padding: 20, borderRadius: 15, elevation: 10 }}>
                <Image
                  source={require("@/assets/images/AI-Character-V1/reading-phone.png")}
                  style={styles.character}
                />
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {" "}
                  No Messages Found. {"\n"}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleConversationPress(item)} style={{ marginBottom: 10 }}>
                <ConversationCard conversation={item} />
              </TouchableOpacity>
            )}
          />
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
    fontSize: 15,
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
  character: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
    marginBottom: 10,
  },
});

export default Inbox;
