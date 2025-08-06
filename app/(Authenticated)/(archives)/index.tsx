import { StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { ImageBackground, TouchableOpacity, Button, Modal } from "react-native";
import Colors from "@/assets/styles/colors";
import getCurrentUserData from "@/app/hooks/users/getCurrentUserData";
import refreshCurrentUserData from "@/app/hooks/users/refreshCurrentUserData";
import UserData from "@/app/types/UserData";
import CustomSwitch from "@/app/components/CustomSwitch";
import useArchives from "@/app/hooks/archives/useArchives";
import { FlatList } from "react-native-gesture-handler";
import ApartmentCards from "@/app/components/PropertyCards/ApartmentCards";
import TransientCard from "@/app/components/PropertyCards/TransientCard";
import Restore from "@/app/hooks/archives/Restore";
import { useRouter } from "expo-router";

const Archives = () => {
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [selectedTab, setSelectedTab] = useState("Archives");
  const [IsArchives, setIsArchives] = useState(false); // State to toggle between Archives and Deleted
  const [Loading, setLoading] = useState<Boolean>(false); // State for loading
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const router = useRouter();

  const { archives, loading } = useArchives(
    selectedTab.toLowerCase() as "archives" | "deleted"
  );

  console.log("Archives Data: ", archives);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      await refreshCurrentUserData();
      const user = await getCurrentUserData();
      if (user) {
        setCurrentUserData(user);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Dummy restore function (replace with actual logic)
  const handleRestore = async (itemId: string, type: string) => {
    await Restore((type + "s") as string, itemId);

    router.replace("/(Authenticated)/(tabs)/Home");
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
              Hey, {currentUserData?.displayName}!
            </Text>
            <View>
              <Text style={styles.subtext}>
                Here are your archived properties!
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <CustomSwitch
            initialValue={IsArchives}
            onValueChange={() => {
              setIsArchives(!IsArchives);
              setSelectedTab(IsArchives ? "Archives" : "Deleted");
            }}
            leftLabel={"Archives"}
            rightLabel={"Deleted"}
          />

          {loading && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Loading archives...
            </Text>
          )}

          {!loading && archives.length === 0 && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No archived properties found.
            </Text>
          )}

          {!loading && archives.length > 0 && (
            <FlatList
              data={archives}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                const restoreDate = item.restoreAfter
                  ? item.restoreAfter.toDate().toLocaleDateString()
                  : null;

                const deleteDate = item.deleteAfter
                  ? item.deleteAfter.toDate().toLocaleDateString()
                  : null;

                const CardComponent =
                  item.type === "apartment" ? ApartmentCards : TransientCard;

                return (
                  <View style={{ marginBottom: 16 }}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => {
                        setSelectedItemId(item.id);
                        const desc = restoreDate
                          ? `Your property will be restored automatically on ${restoreDate}.`
                          : `Your property will be deleted on ${deleteDate}.`;
                        // Use React Native Alert
                        Alert.alert(
                          "Restore Property",
                          desc,
                          [
                            {
                              text: "Restore Now",
                              onPress: () => handleRestore(item.id, item.type), // <-- fix here
                            },
                            {
                              text: "Cancel",
                              style: "cancel",
                              onPress: () => setSelectedItemId(null),
                            },
                          ],
                          { cancelable: true }
                        );
                      }}
                    >
                      <CardComponent
                        images={item.images || []}
                        title={item.title}
                        address={item.address}
                        price={item.price}
                        reviews={item.reviews || []}
                        onPress={() => {
                          setSelectedItemId(item.id);
                          const desc = restoreDate
                            ? `Your property will be restored automatically on ${restoreDate}.`
                            : `Your property will be deleted on ${deleteDate}.`;
                          Alert.alert(
                            "Restore Property",
                            desc,
                            [
                              {
                                text: "Restore Now",
                                onPress: () =>
                                  handleRestore(item.id, item.type), // <-- fix here
                              },
                              {
                                text: "Cancel",
                                style: "cancel",
                                onPress: () => setSelectedItemId(null),
                              },
                            ],
                            { cancelable: true }
                          );
                        }}
                      />
                    </TouchableOpacity>
                    {restoreDate && (
                      <Text
                        style={{
                          textAlign: "center",
                          marginTop: 4,
                          color: Colors.primaryBackground,
                        }}
                      >
                        Restorable until: {restoreDate}
                      </Text>
                    )}
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    </>
  );
};

export default Archives;

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
  topBar: {
    flexDirection: "row",
    marginTop: 65,
    alignItems: "center",
  },
  subtext: {
    fontSize: 15,
    fontWeight: "regular",
    color: Colors.primaryBackground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 150,
    elevation: 5,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.primaryBackground,
    textAlign: "center",
  },
});
