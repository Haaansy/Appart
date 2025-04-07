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
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "@/app/components/CustomButton";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  fetchPropertyCounts,
  fetchAllReviewsForOwner,
} from "@/app/Firebase/Services/DatabaseService";
import UserData from "@/app/types/UserData";
import Review from "@/app/types/Review";
import { FlatList } from "react-native-gesture-handler";
import ReviewCard from "@/app/components/ProfileComponents/ReviewCard";

interface ProfileProps {
  currentUserData: UserData;
}

const Profile: React.FC<ProfileProps> = ({ currentUserData }) => {
  const insets = useSafeAreaInsets();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [propertiesCount, setPropertiesCount] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  const statusBarHeight = StatusBar.currentHeight || 0;
  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;
  const coverHeight = screenHeight * 0.3; // 30% of screen height

  useEffect(() => {
    const fetchPropertiesCount = async () => {
      setLoading(true);
      try {
        const reviews = await fetchAllReviewsForOwner(
          currentUserData.id as string
        );
        const { totalCount } = await fetchPropertyCounts(
          currentUserData.id as string
        );

        if (currentUserData.role === "home owner") {
          setPropertiesCount(totalCount);
          setReviews(reviews);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch properties count");
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesCount();
  }, []);

  return (
    <>
      <View style={[styles.container]}>
        {isLoading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <>
            <Image
              source={{ uri: currentUserData.coverUrl }}
              style={[
                styles.coverImage,
                { width: screenWidth * 1.2, height: coverHeight },
              ]}
            />
            <TouchableOpacity
              style={[
                styles.settingsIcon,
                {
                  top:
                    Platform.OS === "android"
                      ? statusBarHeight + 25
                      : insets.top,
                  right: screenWidth * 0.05, // 5% from right edge
                },
              ]}
              onPress={() =>
                router.replace("/(Authenticated)/(profile)/(profilesettings)")
              }
            >
              <Ionicons name="cog" size={35} color={Colors.primaryBackground} />
            </TouchableOpacity>
            <View style={[styles.avatarContainer, { marginTop: -50 }]}>
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
                  {currentUserData.role === "tenant" &&
                  currentUserData?.reviews &&
                  currentUserData?.reviews.length > 0
                    ? (
                        currentUserData?.reviews.reduce(
                          (acc: number, curr: any) => acc + curr.rating,
                          0
                        ) / currentUserData?.reviews.length
                      ).toFixed(1)
                    : 0}

                  {currentUserData.role === "home owner" &&
                    reviews &&
                    reviews.length > 0 &&
                    (
                      reviews.reduce(
                        (acc: number, curr: any) => acc + curr.rating,
                        0
                      ) / reviews.length
                    ).toFixed(1)}
                </Text>
                <Text>Rating</Text>
              </View>
            </View>
            <View
              style={[styles.buttonsContainer, { width: screenWidth * 0.9 }]}
            >
              <CustomButton
                title="Edit Profile"
                onPress={() =>
                  router.replace(
                    "/(Authenticated)/(profile)/(profilesettings)/Personal"
                  )
                }
                style={[styles.manageButton, { flex: 1 }]}
              />
              <CustomButton
                title="Share Profile"
                onPress={() => {}}
                style={[styles.shareButton, { flex: 1 }]}
              />
            </View>
            {currentUserData.role === "tenant" && (
              <FlatList
                data={currentUserData?.reviews}
                keyExtractor={(item) =>
                  item.userId + "_" + Math.random().toString(36).substring(7)
                }
                renderItem={({ item }) => <ReviewCard review={item} />}
                contentContainerStyle={{
                  marginTop: 20,
                  paddingHorizontal: 25,
                }}
                showsVerticalScrollIndicator={false}
                style={{ width: "100%" }}
                ListEmptyComponent={
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      color: Colors.secondaryText,
                    }}
                  >
                    No reviews yet.
                  </Text>
                }
                ListFooterComponent={<View style={{ height: 20 }} />}
                ItemSeparatorComponent={() => (
                  <View
                    style={{
                      height: 1,
                      backgroundColor: Colors.border,
                      marginVertical: 10,
                    }}
                  />
                )}
              />
            )}

            {currentUserData.role === "home owner" && (
              <FlatList
                data={reviews}
                keyExtractor={(item) =>
                  item.userId + "_" + Math.random().toString(36).substring(7)
                }
                renderItem={({ item }) => <ReviewCard review={item} />}
                contentContainerStyle={{
                  marginTop: 20,
                  paddingHorizontal: 25,
                }}
                showsVerticalScrollIndicator={false}
                style={{ width: "100%" }}
                ListEmptyComponent={
                  <Text
                    style={{
                      textAlign: "center",
                      marginTop: 20,
                      color: Colors.secondaryText,
                    }}
                  >
                    No reviews yet.
                  </Text>
                }
              />
            )}
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  coverImage: {
    backgroundColor: Colors.primary,
    width: "100%",
    resizeMode: "cover",
  },
  settingsIcon: {
    position: "absolute",
    zIndex: 1,
  },
  avatarContainer: {
    backgroundColor: Colors.secondaryBackground,
    padding: 5,
    borderRadius: 75, // Increased for larger screens
    alignSelf: "center",
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
    justifyContent: "space-between",
    paddingHorizontal: 10,
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
