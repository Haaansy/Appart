import {
  View,
  Text,
  Alert,
  Platform,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect } from "react";
import {
  getStoredUserData,
  logoutUser,
} from "@/app/Firebase/Services/AuthService";
import CustomButton from "@/app/components/CustomButton";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import UserData from "@/app/types/UserData";
import Colors from "@/assets/styles/colors";

const index = () => {
  const [currentUserData, setCurrentUserData] = React.useState<UserData | null>(
    null
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        setCurrentUserData(userData);
      } catch (error) {
        console.error("Error while fetching user data:", error);
        Alert.alert("Error", "Failed to fetch user data");
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/(Auth)/LoginScreen");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "flex-start",
          paddingTop: Platform.OS === "android" ? 80 : 0,
          paddingHorizontal: 25,
        }}
      >
        {/* Back Button */}
        <TouchableOpacity onPress={() => router.replace("/(Authenticated)/(tabs)/Profile")}>
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>

        {/* Profile Section */}
        <View>
          <Text style={styles.title}>Profile</Text>
          <View
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{ uri: currentUserData?.photoUrl }}
                style={styles.avatar}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                  {currentUserData?.firstName} {currentUserData?.lastName}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    fontWeight: "semibold",
                    color: Colors.primary,
                  }}
                >
                  @{currentUserData?.displayName}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.line} />

        {/* Settings Section */}
        <ScrollView style={{ width: "100%" }}>
          <Text style={styles.title}> Settings </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
            onPress={() => router.replace("/(Authenticated)/(profile)/(profilesettings)/(pages)/Personal")}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="person-outline"
                size={30}
                color={Colors.primary}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.text}>Personal Information</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
            onPress={() => {}}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="shield-half-outline"
                size={30}
                color={Colors.primary}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.text}>Login & Security</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
            onPress={() => {}}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="notifications-outline"
                size={30}
                color={Colors.primary}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.text}>Notifications</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.line} />

          {/* Support Section */}
          <Text style={styles.title}> Support </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
            onPress={() => {}}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="help-circle-outline"
                size={30}
                color={Colors.primary}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.text}>Help Center</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
            onPress={() => {}}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={30}
                color={Colors.primary}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.text}>Feedback</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.line} />

          {/* Legal Section */}
          <Text style={styles.title}> Legal </Text>
          <TouchableOpacity
            style={{
              marginTop: 20,
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
            onPress={() => {}}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="document-outline"
                size={30}
                color={Colors.primary}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.text}>Terms of Service</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={30} color="black" />
          </TouchableOpacity>
          <View style={styles.line} />
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
            onPress={() => {}}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="document-lock-outline"
                size={30}
                color={Colors.primary}
              />
              <View style={{ marginLeft: 20 }}>
                <Text style={styles.text}>Privacy Policy</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={30} color="black" />
          </TouchableOpacity>

          <View style={styles.line} />

          {/* Logout Button */}
          <CustomButton
            title="Logout"
            onPress={handleLogout}
            style={{ marginTop: 20, backgroundColor: Colors.error }}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "gray",
  },
  line: {
    backgroundColor: Colors.border,
    height: 1,
    width: "100%",
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "regular",
  },
});

export default index;
