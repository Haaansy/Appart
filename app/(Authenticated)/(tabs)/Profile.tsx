import {
  View,
  Text,
  Alert,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  StatusBar,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/app/components/CustomButton";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { fetchUserPropertiesCount } from "@/app/Firebase/Services/DatabaseService";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [propertiesCount, setPropertiesCount] = useState<number>(0);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        setCurrentUserData(userData);
        if (userData) {
          const count = await fetchUserPropertiesCount(userData.id);
          setPropertiesCount(count);
        }
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
            source={{ uri: currentUserData?.coverUrl }}
            style={[styles.coverImage]}
          />
          <TouchableOpacity
            style={[
              styles.settingsIcon,
              {
                top:
                  Platform.OS === "android" ? statusBarHeight + 25 : insets.top,
              },
            ]}
            onPress={() =>
              router.replace("/(Authenticated)/(profile)/(profilesettings)")
            }
          >
            <Ionicons name="cog" size={35} color={Colors.primaryBackground} />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: currentUserData?.photoUrl }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>
            {`${currentUserData?.firstName} ${currentUserData?.lastName}` ||
              "First Name, Last Name"}
          </Text>
          <Text style={styles.username}>
            {`@${currentUserData?.displayName}` || "User"}
          </Text>
          <Text
            style={[
              styles.username,
              { color: Colors.secondaryText, fontSize: 14 },
            ]}
          >
            {currentUserData?.role === "tenant" ? "Tenant" : "Home Owner"}
          </Text>
          <View style={styles.infoContainer}>
            {currentUserData.role === "home owner" && (
              <>
                <View style={styles.infoItem}>
                  <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                    {propertiesCount}
                  </Text>
                  <Text>Properties</Text>
                </View>
                <View style={styles.divider} />
              </>
            )}
            <View style={styles.infoItem}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                { currentUserData?.reviews && currentUserData?.reviews.length > 0 ? (
                  currentUserData?.reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / currentUserData?.reviews.length
                ).toFixed(1) : 0}
              </Text>
              <Text>Rating</Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <CustomButton
              title="Edit Profile"
              onPress={() => router.replace("/(Authenticated)/(profile)/(profilesettings)/Personal")}
              style={styles.manageButton}
            />
            <CustomButton
              title="Share Profile"
              onPress={() => {}}
              style={styles.shareButton}
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

export default Profile;
