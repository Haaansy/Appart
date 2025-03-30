import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/app/components/CustomButton";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import { fetchUserDataFromFirestore } from "@/app/Firebase/Services/DatabaseService";

const index = () => {
  const { userId } = useLocalSearchParams() 
  const insets = useSafeAreaInsets();
  const [UserData, setUserData] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await fetchUserDataFromFirestore(String(userId));
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const statusBarHeight = StatusBar.currentHeight || 0;


  return (
    <View style={[styles.container]}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          <Image
            source={{ uri: UserData?.coverUrl }}
            style={[styles.coverImage]}
          />
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: UserData?.photoUrl }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>
            {`${UserData?.firstName} ${UserData?.lastName}` ||
              "First Name, Last Name"}
          </Text>
          <Text style={styles.username}>
            {`@${UserData?.displayName}` || "User"}
          </Text>
          <Text
            style={[
              styles.username,
              { color: Colors.secondaryText, fontSize: 14 },
            ]}
          >
            {UserData?.role === "tenant" ? "Tenant" : "Home Owner"}
          </Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>3.7</Text>
              <Text>Rating</Text>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  coverImage: {
    backgroundColor: Colors.primary,
    width: "100%",
    height: "30%",
  },
  settingsIcon: {
    position: "absolute",
    right: 25,
    top: 25,
  },
  avatarContainer: {
    marginTop: -50,
    backgroundColor: Colors.secondaryBackground,
    padding: 5,
    borderRadius: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primary,
  },
  name: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    fontWeight: "regular",
    color: Colors.primary,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginHorizontal: 25,
    marginTop: 20,
  },
  infoItem: {
    alignItems: "center",
    marginHorizontal: 10,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: 10,
  },
  buttonsContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginHorizontal: 25,
  },
  manageButton: {
    backgroundColor: Colors.primary,
    marginHorizontal: 5,
  },
  shareButton: {
    backgroundColor: Colors.secondaryText,
    marginHorizontal: 5,
  },
});

export default index;
