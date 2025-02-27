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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import CustomBadge from "@/app/components/CustomBadge";
import IconButton from "@/app/components/IconButton";
import { deleteApartment } from "@/app/Firebase/Services/DatabaseService";
import { useApartment } from "@/app/hooks/apartment/useApartment";

const { width, height } = Dimensions.get("window");

const ViewApartment = () => {
  const { apartmentId } = useLocalSearchParams();
  const { apartment, loading, error } = useApartment(String(apartmentId));
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

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

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  if (loading) return <ActivityIndicator size="large" color="blue" />;
  if (!apartment)
    return (
      <Text style={{ textAlign: "center", marginTop: 20 }}>
        Apartment not found.
      </Text>
    );

  const handleDeleteApartment = async (apartmentId: string) => {
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
              await deleteApartment(apartmentId);
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

  const handleBookApartment = () => {
    router.push(
      `/(Authenticated)/(bookings)/(bookproperty)/${apartmentId}?isApartment=true` as unknown as RelativePathString
    );
  }

  return (
    <View style={{ marginBottom: 200 }}>
      {/* ✅ Scrollable Image Gallery with Centered Indicator */}
      <FlatList
        data={apartment.images || []}
        horizontal
        keyExtractor={(_, index: number) => index.toString()}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View>
            <Image
              source={{ uri: item }}
              style={{
                width: width,
                height: height * 0.4,
                resizeMode: "cover",
              }}
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
              {apartment.images?.map((_: number, index: number) => (
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
        )}
      />
      <View style={styles.container}>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 24, fontWeight: "bold" }}>
              {apartment.title || "Apartment"}
            </Text>
            <Text
              style={{
                fontSize: 12,
                color:
                  apartment.status == "Available"
                    ? Colors.success
                    : Colors.error,
              }}
            >
              {apartment.status || "Status"}
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
              {apartment.address || "Address"}
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
                {apartment.rating || "4.2"}
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
                {`(${apartment.ratingCount})` || "(0)"}
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
                {formatCurrency(apartment.price)}{" "}
              </Text>
              <Text style={{ fontSize: 10, marginLeft: 3 }}>/mo</Text>
            </View>
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Description</Text>
            <Text style={styles.contents}>
              {apartment.description || "Description"}
            </Text>
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Owner Details</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-start",
              }}
            >
              <Image
                source={{
                  uri:
                    apartment.owner?.photoURL ||
                    "https://fastly.picsum.photos/id/998/200/300.jpg?hmac=g3P0EcqrmgGwQk4lFB8zLuXtwjQa0rV_Z9MpUQNWiHg",
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
                  {`${apartment.owner.firstName} ${apartment.owner.lastName}` ||
                    "Owner Name"}
                </Text>
                <Text style={[styles.contents, { fontSize: 12 }]}>
                  {apartment.owner?.rating || "5.0 Rating"}
                </Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="star" size={16} color={Colors.primary} />
                  <Ionicons name="star" size={16} color={Colors.primary} />
                  <Ionicons name="star" size={16} color={Colors.primary} />
                  <Ionicons name="star" size={16} color={Colors.primary} />
                  <Ionicons name="star" size={16} color={Colors.primary} />
                </View>
              </View>
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
            {apartment.tags?.map((tag: string, index: number) => {
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
                text={`${apartment.bedRooms || "No"} Bedroom${
                  apartment.bedRooms > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
              <IconButton
                onPress={() => {}}
                icon={"water"}
                text={`${apartment.bathRooms || "No"} Bathroom${
                  apartment.bathRooms > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
              <IconButton
                onPress={() => {}}
                icon={"tv"}
                text={`${apartment.livingRooms || "No"} Livingroom${
                  apartment.livingRooms > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
              <IconButton
                onPress={() => {}}
                icon={"fast-food"}
                text={`${apartment.kitchen || "No"} Kitchen${
                  apartment.kitchen > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
              <IconButton
                onPress={() => {}}
                icon={"car"}
                text={`${apartment.parking || "No"} Parking Space${
                  apartment.parking > 1 ? "s" : ""
                }`}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
            </View>
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Floor Details</Text>
            <IconButton
              onPress={() => {}}
              icon={"cube"}
              text={`${apartment.area || 1} Square Meter${
                apartment.area > 1 ? "s" : ""
              }`}
              iconColor={Colors.primary}
              style={{ marginBottom: 10 }}
            />
            <IconButton
              onPress={() => {}}
              icon={"reorder-four"}
              text={`${apartment.levels || 1} Floor${
                apartment.levels > 1 ? "s" : ""
              }`}
              iconColor={Colors.primary}
              style={{ marginBottom: 10 }}
            />
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Tenant</Text>
            <IconButton
              onPress={() => {}}
              icon={"person"}
              text={`${apartment.maxTenant || 1} Max Tenant${
                apartment.maxTenant > 1 ? "s" : ""
              }`}
              iconColor={Colors.primary}
              style={{ marginBottom: 10 }}
            />
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Inclusions</Text>
            <Text style={[styles.title, { fontSize: 12, marginTop: -15 }]}>
              What's included in your payments.
            </Text>
            {apartment.electricIncluded && (
              <IconButton
                onPress={() => {}}
                icon={"flash"}
                text={"Electricity Included"}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
            )}
            {apartment.waterIncluded && (
              <IconButton
                onPress={() => {}}
                icon={"water"}
                text={"Water Included"}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
            )}
            {apartment.internetIncluded && (
              <IconButton
                onPress={() => {}}
                icon={"wifi"}
                text={"Internet Included"}
                iconColor={Colors.primary}
                style={{ marginBottom: 10 }}
              />
            )}
            {apartment.waterIncluded == false &&
              apartment.electricIncluded == false &&
              apartment.internetIncluded == false && (
                <IconButton
                  onPress={() => {}}
                  icon={"alert"}
                  text={"No Inclusions"}
                  iconColor={Colors.primary}
                  style={{ marginBottom: 10 }}
                />
              )}
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>House Rules</Text>
            <Text>
              {apartment.houseRules?.map((rule: string, index: number) => (
                <Text key={index} style={styles.contents}>
                  {rule}
                </Text>
              ))}
              {apartment.houseRules?.length == 0 && (
                <Text style={styles.contents}>No Requirements Specified.</Text>
              )}
            </Text>
          </View>
          <View style={styles.line} />
          <View>
            <Text style={styles.title}>Requirements</Text>
            <Text>
              {apartment.requirements?.map(
                (requirements: string, index: number) => (
                  <Text key={index} style={styles.contents}>
                    {requirements}
                  </Text>
                )
              )}
              {apartment.requirements?.length == 0 && (
                <Text style={styles.contents}>No Requirements Specified.</Text>
              )}
            </Text>
          </View>
          <View style={styles.line} />
          {currentUserData.role === "home owner" && (
            <View>
              <Text style={styles.title}>Actions</Text>
              <View>
                <IconButton
                  onPress={() => {
                    router.push(
                      `/(Authenticated)/(apartments)/(editapartment)/${apartmentId}` as unknown as RelativePathString
                    );
                  }}
                  icon={"create"}
                  text={"Edit"}
                  iconColor={Colors.primary}
                  style={{ marginBottom: 10 }}
                />
                <IconButton
                  onPress={() => {
                    handleDeleteApartment(apartmentId.toString());
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
              <View>
                <IconButton
                  onPress={() => {}}
                  icon={"chatbubbles"}
                  text={"Chat with Owner"}
                  iconColor={Colors.primary}
                  style={{ marginBottom: 10 }}
                />
                <IconButton
                  onPress={handleBookApartment}
                  icon={"book"}
                  text={"Reserve a Visit"}
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
    marginTop: -15, // ✅ Slight overlap with the image
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

export default ViewApartment;
