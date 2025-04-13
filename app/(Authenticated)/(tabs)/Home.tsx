import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Colors from "@/assets/styles/colors";
import IconButton from "@/app/components/IconButton";
import CustomSwitch from "@/app/components/CustomSwitch";
import { getApartments } from "@/app/hooks/apartment/getApartments";
import { RelativePathString, router } from "expo-router";
import ApartmentCards from "@/app/components/PropertyCards/ApartmentCards";
import { getTransients } from "@/app/hooks/transient/getTransients";
import TransientCard from "@/app/components/PropertyCards/TransientCard";
import CustomAddDropdown from "@/app/components/HomeComponents/CustomAddDropdown";
import UserData from "@/app/types/UserData";
import Alert from "@/app/types/Alert";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import Review from "@/app/types/Review";

interface HomeProps {
  currentUserData: UserData;
  alerts: Alert[];
}

const Home: React.FC<HomeProps> = ({ currentUserData, alerts }) => {
  const [isTransient, setIsTransient] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<string | null>(null);
  const [locationJson, setLocationJson] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);

  const pendingReviews = alerts.filter((alert) => alert.type === "Review");

  const handleSelect = (option: "transient" | "apartment") => {
    setDropdownVisible(false);
    if (option === "apartment") {
      router.push(
        "/(Authenticated)/(apartments)/(addapartment)" as unknown as RelativePathString
      );
    } else {
      router.push(
        "/(Authenticated)/(transients)/(addtransient)" as unknown as RelativePathString
      );
    }
  };

  const fetchLocation = async () => {
    try {
      setLocationLoading(true);
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const { latitude, longitude } = location.coords;

      // Reverse geocoding to get address from coordinates
      const addressResponse = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressResponse && addressResponse.length > 0) {
        const address = addressResponse[0];
        const locationString = `${address.city || ""}, ${
          address.region || ""
        }`;
        setLocationJson({ latitude, longitude });
        setCurrentLocation(locationString);

        // Refresh data when location updates
        if (isTransient) {
          refreshTransients();
        } else {
          refreshApartments();
        }
      }
    } catch (locationError) {
      console.error("Error getting location:", locationError);
      setCurrentLocation("Location unavailable");
    } finally {
      setLocationLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!currentUserData) {
          console.log("No user data found");
          setLoading(false);
          return;
        }

        if (
          currentUserData.firstName === undefined ||
          currentUserData.firstName === ""
        ) {
          router.replace("/(Authenticated)/(setup)/(initialsetup)");
        } else if (
          currentUserData.displayName === undefined ||
          currentUserData.displayName === ""
        ) {
          router.replace("/(Authenticated)/(setup)/(finishsetup)");
        } else {
          // Check permissions before proceeding
          const locationPermission = await Location.getForegroundPermissionsAsync();
          const cameraPermission = await ImagePicker.getMediaLibraryPermissionsAsync();

          if (!locationPermission.granted || !cameraPermission.granted) {
            console.log("Permissions not granted");
            router.replace(
              "/(Authenticated)/(setup)/(permissions)" as unknown as RelativePathString
            );
            return;
          }

          // Get current location
          await fetchLocation();
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();

    if (pendingReviews.length > 0) {
      if (currentUserData.role === "tenant") {
        router.replace({
          pathname: `/(Authenticated)/(review)/(property)/${pendingReviews[0].bookingId}` as RelativePathString,
          params: { alertId: pendingReviews[0].id },
        });
      } else {
        router.replace({
          pathname: `/(Authenticated)/(review)/(tenant)/${pendingReviews[0].tenantId}` as RelativePathString,
          params: { alertId: pendingReviews[0].id },
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && locationJson) {
      if (isTransient) {
        refreshTransients();
      } else {
        refreshApartments();
      }
    }
  }, [isTransient, locationJson]);

  const {
    apartments,
    loading: apartmentsLoading,
    error: apartmentsError,
    fetchMore: fetchMoreApartments,
    refresh: refreshApartments,
  } = getApartments(currentUserData?.role, String(currentUserData?.id), locationJson);

  const {
    transients,
    loading: transientsLoading,
    error: transientsError,
    fetchMore: fetchMoreTransients,
    refresh: refreshTransients,
  } = getTransients(currentUserData?.role, String(currentUserData?.id), locationJson);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      if (isTransient) {
        await refreshTransients();
      } else {
        await refreshApartments();
      }
    } catch (error) {
      alert("An error occurred during refresh.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSearch = () => {
    router.push(
      "/(Authenticated)/(casabot)" as unknown as RelativePathString
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ fontSize: 15, marginTop: 5 }}>Fetching User Data</Text>
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
              Hey, {currentUserData["displayName"]}!
            </Text>
            <View style={styles.locationContainer}>
              <Text style={styles.subtext}>Looking for somewhere to stay?</Text>
              <TouchableOpacity 
                style={styles.locationTextContainer} 
                onPress={fetchLocation}
                disabled={locationLoading}
              >
                {locationLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={Colors.primaryBackground}
                    style={styles.locationLoader}
                  />
                ) : (
                  currentLocation && (
                    <Text style={styles.locationText}>
                      <Ionicons name="location" size={12} />
                      {" "}
                      {currentLocation} 
                      <Ionicons name="refresh" size={10} style={styles.refreshIcon} />
                    </Text>
                  )
                )}
              </TouchableOpacity>
            </View>
          </View>

          <IconButton
            icon={currentUserData.role === "tenant" ? "search" : "add"}
            onPress={
              currentUserData.role === "tenant"
                ? handleSearch
                : () => setDropdownVisible(true)
            }
            style={styles.iconButton}
            iconColor={Colors.primaryBackground}
            iconSize={34}
            borderWidth={0}
          />
          <CustomAddDropdown
            visible={dropdownVisible}
            onClose={() => setDropdownVisible(false)}
            onSelect={handleSelect}
          />
        </View>
        <View style={{ marginTop: 20 }}>
          <CustomSwitch
            initialValue={isTransient}
            onValueChange={setIsTransient}
            leftLabel={"Apartments"}
            rightLabel={"Transients"}
          />
        </View>
        <View style={{ flex: 1, marginTop: 20, marginBottom: 100 }}>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={{ fontSize: 15, marginTop: 5 }}>
                {" "}
                Fetching Properties{" "}
              </Text>
            </View>
          ) : isTransient ? (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={transients}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={({ item }) => (
                <TransientCard
                  images={item.images}
                  title={item.title}
                  address={item.address}
                  price={item.price}
                  reviews={item.reviews as Review[]}
                  onPress={() =>
                    router.push(
                      `/(Authenticated)/(transients)/(viewtransient)/${item.id}` as unknown as RelativePathString
                    )
                  }
                />
              )}
              ListEmptyComponent={
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Image
                    source={require("@/assets/images/AI-Character-V1/confused.png")}
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
                    No Transients Found. {"\n"}
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "regular",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      Pull to refresh{" "}
                    </Text>
                  </Text>
                </View>
              }
              onEndReached={fetchMoreTransients}
              onEndReachedThreshold={0.1}
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              ListFooterComponent={
                transientsLoading ? <ActivityIndicator size="small" /> : null
              }
              contentContainerStyle={{ flexGrow: 1 }}
              style={{ flex: 1 }}
            />
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={apartments}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={({ item }) => (
                <ApartmentCards
                  images={item.images}
                  title={item.title}
                  address={item.address}
                  price={item.price}
                  reviews={item.reviews}
                  onPress={() =>
                    router.push(
                      `/(Authenticated)/(apartments)/(viewapartment)/${item.id}` as unknown as RelativePathString
                    )
                  }
                />
              )}
              ListEmptyComponent={
                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <Image
                    source={require("@/assets/images/AI-Character-V1/confused.png")}
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
                    No Apartments Found. {"\n"}
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "regular",
                        textAlign: "center",
                      }}
                    >
                      {" "}
                      Pull to refresh{" "}
                    </Text>
                  </Text>
                </View>
              }
              onEndReached={fetchMoreApartments}
              onEndReachedThreshold={0.1}
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              ListFooterComponent={
                apartmentsLoading ? <ActivityIndicator size="small" /> : null
              }
              contentContainerStyle={{ flexGrow: 1 }}
              style={{ flex: 1 }}
            />
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
  iconButton: {
    marginLeft: "auto",
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary,
  },
  character: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
    marginBottom: 10,
  },
  locationContainer: {
    flexDirection: "column",
    width: "100%",
  },
  locationTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  locationText: {
    fontSize: 12,
    color: Colors.primaryBackground,
    marginTop: 2,
    fontWeight: "500",
  },
  refreshIcon: {
    marginLeft: 25,
  },
  locationIcon: {
    width: 10,
    height: 10,
    resizeMode: "contain",
  },
  locationLoader: {
    marginTop: 2,
  },
});

export default Home;
