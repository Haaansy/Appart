import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Colors from "@/assets/styles/colors";
import IconButton from "@/app/components/IconButton";
import CustomSwitch from "@/app/components/CustomSwitch";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import { getApartments } from "@/app/hooks/apartment/getApartments";
import { RelativePathString, router } from "expo-router";
import ApartmentCards from "@/app/components/PropertyCards/ApartmentCards";
import { getTransients } from "@/app/hooks/transient/getTransients";
import TransientCard from "@/app/components/PropertyCards/TransientCard";
import CustomAddDropdown from "@/app/components/HomeComponents/CustomAddDropdown";
import UserData from "@/app/types/UserData";

interface HomeProps {
  currentUserData: UserData
}

const Home: React.FC<HomeProps> = ({
  currentUserData
}) => {
  console.log(currentUserData)

  const [isTransient, setIsTransient] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {

        if (!currentUserData) {
          console.log("No user data found");
          setLoading(false);
          return;
        }

        if (currentUserData.firstName === undefined || currentUserData.firstName === "") {
          router.replace("/(Authenticated)/(setup)/(initialsetup)");
        } else if (currentUserData.displayName === undefined || currentUserData.displayName === "") {
          router.replace("/(Authenticated)/(setup)/(finishsetup)");
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const {
    apartments,
    loading: apartmentsLoading,
    error: apartmentsError,
    fetchMore: fetchMoreApartments,
    refresh: refreshApartments,
  } = getApartments(currentUserData?.role, String(currentUserData?.id));

  const {
    transients,
    loading: transientsLoading,
    error: transientsError,
    fetchMore: fetchMoreTransients,
    refresh: refreshTransients,
  } = getTransients(currentUserData?.role, String(currentUserData?.id));

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
    // Handle tenant search
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
            <Text style={styles.subtext}>Looking for somewhere to stay?</Text>
          </View>
          <IconButton
            icon={currentUserData.role === "tenant" ? "search" : "add"}
            onPress={
              currentUserData.role === "tenant"
                ? handleSearch
                : () => setDropdownVisible(true)
            }
            style={styles.iconButton}
            iconColor={Colors.primary}
            iconSize={24}
            width={60}
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
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={{ fontSize: 15, marginTop: 5 }}> Fetching Properties </Text>
            </View>
          ) : isTransient ? (
            <FlatList
              data={transients}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={({ item }) => (
                <TransientCard
                  images={[item.images]}
                  title={item.title}
                  address={item.address}
                  price={item.price}
                  onPress={() =>
                    router.push(
                      `/(Authenticated)/(transients)/(viewtransient)/${item.id}` as unknown as RelativePathString
                    )
                  }
                />
              )}
              ListEmptyComponent={
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                  <Image source={require("@/assets/images/AI-Character-V1/confused.png")} style={styles.character}/>
                  <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center"}}> No Transients Found. {'\n'} 
                    <Text style={{ fontSize: 12, fontWeight: "regular", textAlign: "center"}}> Pull to refresh </Text>
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
              data={apartments}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={({ item }) => (
                <ApartmentCards
                  images={item.images}
                  title={item.title}
                  address={item.address}
                  price={item.price}
                  onPress={() =>
                    router.push(
                      `/(Authenticated)/(apartments)/(viewapartment)/${item.id}` as unknown as RelativePathString
                    )
                  }
                />
              )}
              ListEmptyComponent={
                <View style={{ alignItems: "center", justifyContent: "center" }}>
                  <Image source={require("@/assets/images/AI-Character-V1/confused.png")} style={styles.character}/>
                  <Text style={{ fontSize: 16, fontWeight: "bold", textAlign: "center"}}> No Apartments Found. {'\n'} 
                    <Text style={{ fontSize: 12, fontWeight: "regular", textAlign: "center"}}> Pull to refresh </Text>
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
    fontSize: 12,
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
  },
  character: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
    marginBottom: 10
  }
});

export default Home;
