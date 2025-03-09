import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Colors from "@/assets/styles/colors";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import UserData from "@/app/types/UserData";
import CustomSwitch from "@/app/components/CustomSwitch";
import PropertyCard from "@/app/components/ManageComponents/PropertyCard";
import { getApartments } from "@/app/hooks/apartment/getApartments";
import { getTransients } from "@/app/hooks/transient/getTransients";
import Apartment from "@/app/types/Apartment";
import Transient from "@/app/types/Transient";

const Manage = () => {
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isTransient, setIsTransient] = useState<boolean>(false);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [transients, setTransients] = useState<Transient[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch user data first
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        if (userData) {
          setCurrentUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const {
    apartments: fetchedApartments,
    loading: apartmentsLoading,
    error: apartmentsError,
    fetchMore: fetchMoreApartments,
    refresh: refreshApartments,
  } = getApartments(String(currentUserData?.role), String(currentUserData?.id));

  const {
    transients: fetchedTransients,
    loading: transientsLoading,
    error: transientsError,
    fetchMore: fetchMoreTransients,
    refresh: refreshTransients,
  } = getTransients(String(currentUserData?.role), String(currentUserData?.id));

  useEffect(() => {
    setApartments(fetchedApartments.filter((a) => a.status === "Unavailable"));
    setTransients(fetchedTransients.filter((t) => t.status === "Unavailable"));
  }, [fetchedApartments, fetchedTransients]);

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

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
            <Text style={styles.subtext}>
              You can manage your properties here.
            </Text>
          </View>
        </View>

        {/* Replace tabs with CustomSwitch */}
        <View style={styles.switchContainer}>
          <CustomSwitch
            initialValue={isTransient}
            onValueChange={(value) => setIsTransient(value)}
            leftLabel="Booked Apartments"
            rightLabel="Booked Transient"
          />
        </View>

        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={{ fontSize: 15, marginTop: 5 }}>
              {" "}
              Fetching Properties{" "}
            </Text>
          </View>
        ) : isTransient ? (
          <FlatList
            data={transients}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={({ item }) => (
              <PropertyCard property={item} onPress={() => {}} />
            )}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text>No Booked Transient</Text>
              </View>
            }
            onEndReached={fetchMoreTransients}
            onEndReachedThreshold={0.1}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={
              transientsLoading ? <ActivityIndicator size="small" /> : null
            }
            contentContainerStyle={{ flexGrow: 1, marginTop: 25 }}
            style={{ flex: 1 }}
          />
        ) : (
          <FlatList
            data={apartments}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={({ item }) => (
              <PropertyCard property={item} onPress={() => {}} />
            )}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 50 }}>
                <Text>No Booked Apartment</Text>
              </View>
            }
            onEndReached={fetchMoreApartments}
            onEndReachedThreshold={0.1}
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            ListFooterComponent={
              apartmentsLoading ? <ActivityIndicator size="small" /> : null
            }
            contentContainerStyle={{ flexGrow: 1, marginTop: 25 }}
            style={{ flex: 1 }}
          />
        )}
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
    fontSize: 12,
    fontWeight: "regular",
    color: Colors.primaryBackground,
  },
  topBar: {
    flexDirection: "row",
    marginTop: 65,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  propertyCard: {
    backgroundColor: Colors.primaryBackground,
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  propertyInfo: {
    padding: 15,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  propertyAddress: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#f0f0f0",
  },
  messageButton: {
    backgroundColor: Colors.primary,
    position: "relative",
  },
  editButtonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  messageButtonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
  },
  unreadBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff3b30",
  },
  addPropertyButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  addPropertyText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#777",
    fontStyle: "italic",
  },
  switchContainer: {
    marginTop: 20,
  },
  tabContent: {
    paddingTop: 15,
  },
});

export default Manage;
