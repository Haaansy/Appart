import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/app/components/CustomButton";
import {
  getStoredUserData,
  logoutUser,
} from "@/app/Firebase/Services/AuthService";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        setCurrentUserData(userData);
        console.log("Profile: User data fetched:", userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Image
            source={{ uri: currentUserData.coverUrl }}
            style={{
              backgroundColor: Colors.primary,
              width: "100%",
              height: "30%",
            }}
          />
          <TouchableOpacity style={{ position: "absolute", right: 25, top: 25}} onPress={
            () => router.push("/(Authenticated)/(profile)/(profilesettings)")
          }>
            <Ionicons name="cog" size={40} color={Colors.primaryBackground} />
          </TouchableOpacity>
          <View
            style={{
              marginTop: -50,
              backgroundColor: Colors.primaryBackground,
              padding: 5,
              borderRadius: 50,
            }}
          >
            <Image
              source={{ uri: currentUserData.photoUrl }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>
            {`${currentUserData?.firstName} ${currentUserData?.lastName}` ||
              "First Name, LastName"}
          </Text>
          <Text style={styles.username}>
            {`@${currentUserData?.displayName}` || "User"}
          </Text>
          <Text style={styles.username}>
            {currentUserData?.role == "tenant" ? "Tenant" : "Home Owner"}
          </Text>
          <View
          style={{ marginTop: 20, flexDirection: "row", justifyContent: "center", width: "100%", marginHorizontal: 25 }}>
            { currentUserData?.role == "home owner" && (
              <CustomButton
              title="Manage Apartments"
              onPress={() => {}}
              style={{ backgroundColor: Colors.primary, marginHorizontal: 5 }}
              />
            )}
            <CustomButton
              title="Share Profile"
              onPress={() => {}}
              style={{ backgroundColor: Colors.secondaryText, marginHorizontal: 5 }}
            />
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    fontSize: 16,
    fontWeight: "regular",
  },
  role: {
    fontSize: 14,
    fontWeight: "regular",
  },
});

export default Profile;
