import {
  Text,
  ActivityIndicator,
  Image,
  FlatList,
  View,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { RelativePathString, router, useLocalSearchParams } from "expo-router";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import CustomBadge from "@/app/components/CustomBadge";
import IconButton from "@/app/components/IconButton";
import { useTransient } from "@/app/hooks/transient/useTransient";
import {
  createConversation,
  deleteTransient,
  fetchUserDataFromFirestore,
} from "@/app/Firebase/Services/DatabaseService";
import useCheckExistingBooking from "@/app/hooks/bookings/useCheckExistingBooking";
import Conversation from "@/app/types/Conversation";
import UserData from "@/app/types/UserData";
import { checkExistingConversationWithTenants } from "@/app/hooks/inbox/useCheckExistingConversationWithTenants";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

const ViewTransient = () => {
  const { transientId } = useLocalSearchParams();
  const {
    transient,
    loading: transientLoading,
    error: transientError,
  } = useTransient(String(transientId));
  const [currentUserData, setCurrentUserData] = useState<UserData>(
    {} as UserData
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [ownerData, setOwnerData] = useState<UserData>({} as UserData);
  const [loading, setLoading] = useState<boolean>(false);

  const formatCurrency = (
    price: number,
    locale = "en-US",
    currency = "PHP"
  ) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getStoredUserData();
      if (userData) {
        setCurrentUserData(userData);
      } else {
        router.replace("/(Unauthenticated)/Login");
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const fetchOwnerData = async () => {
      const ownerData = await fetchUserDataFromFirestore(transient.ownerId);
      if (ownerData) {
        setOwnerData(ownerData);
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [transient]);

  useEffect(() => {
    setLoading(transientLoading);
  }, [transientLoading]);

  const { hasExistingBooking, loading: hasExistingBookingLoading } =
    useCheckExistingBooking(String(transientId));

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;
  if (!transient)
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        Apartment not found.
      </Text>
    );

  const handleDeleteTransient = async (apartmentId: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this apartment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await deleteTransient(apartmentId);
              router.push("/(Authenticated)/(tabs)/Home");
            } catch (error) {
              console.error("Failed to delete apartment:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleBookTransient = () => {
    if (hasExistingBooking) {
      Alert.alert(
        "Booking Error",
        "You already have an existing booking for this transient."
      );
      return;
    }

    router.push(
      `/(Authenticated)/(bookings)/(bookproperty)/${transientId}?isApartment=false` as unknown as RelativePathString
    );
  };

  const handleInquireTransient = async () => {
    try {
      const existingConversation = await checkExistingConversationWithTenants(
        String(transientId),
        [currentUserData.id as string],
        transient.ownerId
      );

      if (existingConversation) {
        router.push(
          `/(Authenticated)/(inbox)/(viewconversation)/${existingConversation.id}`
        );
        return;
      }

      const conversationData: Conversation = {
        lastMessage: "Started a conversation",
        members: [
          { user: currentUserData, count: 0 },
          { user: ownerData, count: 0 },
        ],
        propertyId: String(transientId),
        memberIds: [currentUserData.id, transient.ownerId],
        type: "Inquiry",
        inquiryType: "Transient",
        lastSender: currentUserData,
      };

      const createdConversationId = await createConversation(conversationData);
      if (createdConversationId) {
        router.push(
          `/(Authenticated)/(inbox)/(viewconversation)/${createdConversationId.id}`
        );
      }
    } catch (error) {
      console.error("[ERROR] Failed to create or check conversation:", error);
    }
  };

  const handleImagePress = (imageUri: string) => {
    console.log(
      "Navigation to: ",
      `/(Authenticated)/(utilities)/(image-viewer)/${encodeURIComponent(
        imageUri
      )}` as unknown as RelativePathString
    );
    router.push(
      `/(Authenticated)/(utilities)/(image-viewer)/${encodeURIComponent(
        imageUri
      )}` as unknown as RelativePathString
    );
  };

  return (
    <View style={{ marginBottom: 5 }}>
      {/* ✅ Scrollable Image Gallery with Centered Indicator */}
      <View style={{ height: height * 0.4, position: "relative" }}>
        <FlatList
          data={transient.images || []}
          horizontal
          keyExtractor={(_, index: number) => index.toString()}
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          onMomentumScrollEnd={handleScroll}
          renderItem={({ item }) => (
            <View style={{ width: width, height: height * 0.4 }}>
              <TouchableWithoutFeedback onPress={() => handleImagePress(item)}>
                <Image
                  source={{ uri: item }}
                  style={{
                    width: width,
                    height: height * 0.4,
                    resizeMode: "cover",
                  }}
                />
              </TouchableWithoutFeedback>
            </View>
          )}
        />
        {/* 🔹 Pagination Dots Positioned at the Center-Bottom */}
        <View
          style={{
            position: "absolute",
            bottom: 50,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingVertical: 5,
            borderRadius: 10,
            alignSelf: "center",
            width: "30%",
          }}
        >
          {transient.images?.map((_: number, index: number) => (
            <View
              key={index}
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  index === currentIndex ? Colors.primary : "white",
                marginHorizontal: 5,
              }}
            />
          ))}
        </View>
      </View>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: height * 0.2 }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {transient.title || "Apartment"}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color:
                  transient.status == "Available"
                    ? Colors.success
                    : Colors.error,
              }}
            >
              {transient.status || "Status"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              marginTop: 10,
              paddingHorizontal: 10,
            }}
          >
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "regular",
                color: Colors.secondaryText,
                marginLeft: 5,
              }}
            >
              {transient.address || "Address"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingHorizontal: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Ionicons name="star" size={16} color={Colors.primary} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "semibold",
                  color: Colors.primaryText,
                  marginLeft: 5,
                }}
              >
                { transient.reviews && transient.reviews.length > 0 ? (
                  transient.reviews.reduce((sum: any, review: any) => sum + review.rating, 0) / transient.reviews.length
                ).toFixed(1)
                : (
                  "No reviews"
                ) }
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "regular",
                  color: Colors.primaryText,
                  marginRight: 5,
                  marginLeft: 2,
                }}
              >
                { transient.reviews && transient.reviews.length > 0 ? (
                  `(${transient.reviews.length})`
                ): (
                  ""
                ) }
              </Text>
              <TouchableOpacity>
                <Ionicons
                  name="chevron-forward-outline"
                  size={16}
                  color={Colors.primaryText}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-end",
                justifyContent: "flex-start",
              }}
            >
              <Text style={styles.price}>
                {" "}
                {formatCurrency(transient.price)}{" "}
              </Text>
              <Text style={{ fontSize: 10, marginLeft: 3 }}>/night</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Description</Text>
            <Text style={styles.contents}>
              {transient.description || "Description"}
            </Text>
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Owner Details</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Image
                  source={{
                    uri: ownerData?.photoUrl,
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 10,
                  }}
                />
                <View style={{ flexDirection: "column", marginLeft: 10 }}>
                  <Text style={styles.contents}>
                    {`${ownerData?.firstName} ${ownerData?.lastName}` ||
                      "Owner Name"}
                  </Text>
                  <Text style={{ fontSize: 12, color: Colors.primary }}>
                    @{ownerData?.displayName || "Username"}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={{
                  alignItems: "center",
                  flexDirection: "row",
                  marginLeft: 10,
                }}
              >
                <Text style={{ fontSize: 12, color: Colors.primary }}>
                  View Profile
                </Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={24}
                  color={Colors.primaryText}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.line} />
          <Text style={styles.title}>Tags</Text>
          <View
            style={{
              gridAutoRows: "auto",
              flexDirection: "row",
              flexWrap: "wrap",
            }}
          >
            {transient.tags?.map((tag: string, index: number) => {
              return (
                <CustomBadge
                  key={index}
                  title={tag}
                  style={{ margin: 5, backgroundColor: Colors.primary }}
                />
              );
            })}
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Rooms</Text>
            <View>
              <IconButton
                onPress={() => {}}
                icon={"bed"}
                text={`${transient.bedRooms || "No"} Bedroom${
                  transient.bedRooms > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
              <IconButton
                onPress={() => {}}
                icon={"water"}
                text={`${transient.bathRooms || "No"} Bathroom${
                  transient.bathRooms > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
              <IconButton
                onPress={() => {}}
                icon={"tv"}
                text={`${transient.livingRooms || "No"} Livingroom${
                  transient.livingRooms > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
              <IconButton
                onPress={() => {}}
                icon={"fast-food"}
                text={`${transient.kitchen || "No"} Kitchen${
                  transient.kitchen > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
              <IconButton
                onPress={() => {}}
                icon={"car"}
                text={`${transient.parking || "No"} Parking Space${
                  transient.parking > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
            </View>
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Guest</Text>
            <IconButton
              onPress={() => {}}
              icon={"person"}
              text={`${transient.maxGuests || 1} Max Guest${
                transient.maxGuests > 1 ? "s" : ""
              }`}
              iconColor={Colors.primary}
              style={{ marginBottom: 10 }}
            />
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>House Rules</Text>
              {transient.houseRules?.map((rule: string, index: number) => (
                <Text key={index} style={styles.contents}>
                  {rule} {"\n"}
                </Text>
              ))}
              {transient.houseRules?.length == 0 && (
                <Text style={styles.contents}>No Requirements Specified.</Text>
              )}
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Requirements</Text>
              {transient.requirements?.map(
                (requirements: string, index: number) => (
                  <Text key={index} style={styles.contents}>
                    {requirements} {"\n"}
                  </Text>
                )
              )}
              {transient.requirements?.length == 0 && (
                <Text style={styles.contents}>No Requirements Specified.</Text>
              )}
          </View>
          <View style={styles.line} />
          {currentUserData.role === "home owner" && (
            <View>
              <Text style={styles.title}>Actions</Text>
              <View>
                <IconButton
                  onPress={() => {
                    router.push(
                      `/(Authenticated)/(transients)/(edittransient)/${transientId}` as unknown as RelativePathString
                    );
                  }}
                  icon={"create"}
                  text={"Edit"}
                  iconColor={Colors.primary}
                  style={{ marginBottom: 10 }}
                />
                <IconButton
                  onPress={() => {
                    handleDeleteTransient(transientId.toString());
                  }}
                  icon={"trash"}
                  text={"Delete"}
                  iconColor={Colors.error}
                  style={{ marginBottom: 10 }}
                />
              </View>
            </View>
          )}
          {currentUserData.role === "tenant" && (
            <View>
              <Text style={styles.title}>Actions</Text>
              <View style={{ marginBottom: 10 }}>
                <IconButton
                  onPress={handleInquireTransient}
                  icon={"chatbubbles"}
                  text={"Chat with Owner"}
                  iconColor={Colors.primary}
                  style={{ marginBottom: 10 }}
                />
                <IconButton
                  onPress={handleBookTransient}
                  icon={"book"}
                  text={"Book Transient"}
                  iconColor={Colors.primary}
                  style={{ marginBottom: 10 }}
                />
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground,
    width: width,
    height: "75%",
    borderTopLeftRadius: 25, // ✅ Rounded top edges
    borderTopRightRadius: 25, // ✅ Rounded top edges
    marginTop: -25, // ✅ Slight overlap with the image
    padding: 20, // Optional padding for content inside
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: Colors.alternate,
    marginVertical: 25,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primaryText,
    textAlign: "right",
    alignContent: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "semibold",
    color: Colors.secondaryText,
    marginBottom: 10,
  },
  contents: {
    fontSize: 14,
    fontWeight: "regular",
    color: Colors.primaryText,
  },
});

export default ViewTransient;
