import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import {
  fetchAllReviewsForOwner,
  fetchPropertyCounts,
  fetchUserDataFromFirestore,
} from "@/app/Firebase/Services/DatabaseService";
import Review from "@/app/types/Review";
import UserData from "@/app/types/UserData";
import ReviewCard from "@/app/components/ProfileComponents/ReviewCard";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { set } from "date-fns";

const index = () => {
  const { userId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [propertiesCount, setPropertiesCount] = useState<number>(0);
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUserData = await fetchUserDataFromFirestore(
          String(userId)
        );
        setUserData(fetchedUserData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchPropertiesCount = async () => {
      if (!userData) {
        setLoading(false);
        return;
      }

      try {
        const reviews = await fetchAllReviewsForOwner(userData.id as string);
        const { totalCount } = await fetchPropertyCounts(userData.id as string);

        if (userData.role === "home owner") {
          setPropertiesCount(totalCount);
          setReviews(reviews);

          console.log("Reviews:", reviews);
          console.log("Properties Count:", totalCount);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to fetch properties count" + error);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertiesCount();
  }, [userData]);

  return (
    <View style={[styles.container]}>
      {loading == true ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          <Image
            source={{ uri: userData?.coverUrl }}
            style={[styles.coverImage]}
          />
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userData?.photoUrl }} style={styles.avatar} />
          </View>
          <Text style={styles.name}>
            {`${userData?.firstName} ${userData?.lastName}` ||
              "First Name, Last Name"}
          </Text>
          <Text style={styles.username}>
            {`@${userData?.displayName}` || "User"}
          </Text>
          <Text
            style={[
              styles.username,
              { color: Colors.secondaryText, fontSize: 14 },
            ]}
          >
            {userData?.role === "tenant" ? "Tenant" : "Home Owner"}
          </Text>
          <View style={styles.infoContainer}>
            {userData?.role === "home owner" && (
              <View style={styles.infoItem}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  {propertiesCount}
                </Text>
                <Text>Properties</Text>
              </View>
            )}

            <View style={styles.divider} />

            <View style={styles.infoItem}>
              <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                {userData?.role === "tenant" &&
                userData?.reviews &&
                userData?.reviews.length > 0
                  && (
                      userData?.reviews.reduce(
                        (acc: number, curr: any) => acc + curr.rating,
                        0
                      ) / userData?.reviews.length
                    ).toFixed(1)
                  }

                {userData?.role === "home owner" &&
                  reviews &&
                  reviews.length > 0 ?
                  (
                    reviews.reduce(
                      (acc: number, curr: any) => acc + curr.rating,
                      0
                    ) / reviews.length
                  ).toFixed(1) : 0}
              </Text>
              <Text>Rating</Text>
            </View>
          </View>

          {userData?.role === "tenant" && (
            <FlatList
              data={userData?.reviews}
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

          {userData?.role === "home owner" && (
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
