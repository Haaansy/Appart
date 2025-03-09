import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar,
  Alert,
  BackHandler,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import UserData from "@/app/types/UserData";
import {
  getStoredUserData,
  storeUserDataLocally,
} from "@/app/Firebase/Services/AuthService";
import { auth } from "@/app/Firebase/FirebaseConfig";
import CustomButton from "@/app/components/CustomButton";
import EditValuesPopup from "@/app/components/ProfileComponents/EditValuesPopup";
import Tenant from "@/app/types/Tenant";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { updateUserData } from "@/app/Firebase/Services/DatabaseService";
import { set } from "date-fns";
import {
  uploadAvatar,
  uploadCover,
} from "@/app/Firebase/Services/StorageService";
import { router } from "expo-router";
import { User } from "firebase/auth";

const Personal = () => {
  const insets = useSafeAreaInsets();
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [editValuesModalVisible, setEditValuesModalVisible] =
    useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [valueToChange, setValueToChange] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getStoredUserData();
        setCurrentUserData(userData);
      } catch (error) {
        console.error("Error while fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const pickImage = async (
    setImage: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Update the aspect ratio here
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleEditValues = (value: string) => {
    setValueToChange(value);
    setEditValuesModalVisible(true);
  };

  const handleConfirm = (value: string) => {
    if (valueToChange === "First Name") {
      setFirstName(value);
    } else if (valueToChange === "Last Name") {
      setLastName(value);
    } else if (valueToChange === "Email Address") {
      setEmail(value);
    } else if (valueToChange === "Phone Number") {
      setPhoneNumber(value);
    }
    setEditValuesModalVisible(false);
  };

  const saveChanges = async () => {
    setLoading(true);
    try {
      if (coverPhoto !== null) {
        // Upload cover photo
        const uploadedCover = uploadCover(coverPhoto);

        if (uploadedCover) {
          setCoverPhoto(String(uploadedCover));
        }
      }

      if (profilePhoto !== null) {
        // Upload cover photo
        const uploadedProfilePhoto = uploadAvatar(profilePhoto);

        if (uploadedProfilePhoto) {
          setProfilePhoto(String(uploadedProfilePhoto));
        }
      }

      const updatedUserData: Partial<UserData> = {
        ...currentUserData,
        firstName:
          firstName !== null ? firstName : currentUserData?.firstName || "",
        lastName:
          lastName !== null ? lastName : currentUserData?.lastName || "",
        phoneNumber:
          phoneNumber !== null
            ? phoneNumber
            : currentUserData?.phoneNumber || "",
        coverUrl:
          coverPhoto !== null ? coverPhoto : currentUserData?.photoUrl || "",
        photoUrl:
          profilePhoto !== null
            ? profilePhoto
            : currentUserData?.coverUrl || "",
      };

      // Update user data
      await updateUserData(currentUserData?.id || "", updatedUserData);
      await storeUserDataLocally(auth.currentUser as User);
      router.replace("/(Authenticated)/(tabs)/Profile");
    } catch (error) {
      console.error("Error while saving changes:", error);
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container]}>
      {isLoading ? (
        <ActivityIndicator size="large" color={Colors.primary} />
      ) : (
        <>
          <TouchableOpacity
            style={[styles.coverImage]}
            onPress={() => pickImage(setCoverPhoto)}
          >
            <Image
              source={{ uri: coverPhoto || currentUserData?.coverUrl || "" }}
              style={[
                styles.coverImage,
                { resizeMode: "cover", height: "100%" },
              ]}
            />
            <Ionicons
              name="camera"
              size={35}
              color="white"
              style={styles.cameraIcon}
            />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <TouchableOpacity onPress={() => pickImage(setProfilePhoto)}>
              <Image
                source={{
                  uri: profilePhoto || currentUserData?.photoUrl || "",
                }}
                style={[styles.avatar, { resizeMode: "cover" }]}
              />
              <Ionicons
                name="camera"
                size={25}
                color="white"
                style={styles.cameraIcon}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text> Change Photo </Text>
          </View>
          <View
            style={{
              marginTop: 20,
              alignSelf: "flex-start",
              paddingHorizontal: 25,
            }}
          >
            <Text style={styles.header}> Personal Information </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 20,
              }}
            >
              <Text style={styles.title}> First Name </Text>
              <TouchableOpacity onPress={() => handleEditValues("First Name")}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>
                    {" "}
                    {firstName !== null
                      ? firstName
                      : currentUserData?.firstName}{" "}
                  </Text>
                  <Ionicons name="chevron-forward" size={15} color="black" />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 5,
              }}
            >
              <Text style={styles.title}> Last Name </Text>
              <TouchableOpacity onPress={() => handleEditValues("Last Name")}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>
                    {" "}
                    {lastName !== null
                      ? lastName
                      : currentUserData?.lastName}{" "}
                  </Text>
                  <Ionicons name="chevron-forward" size={15} color="black" />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 25,
              }}
            >
              <Text style={styles.title}> Username </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: Colors.primary }}>
                  {" "}
                  @{currentUserData?.displayName}{" "}
                </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 25,
              }}
            >
              <View>
                <Text style={styles.title}> Email Address </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: auth.currentUser?.emailVerified
                      ? Colors.success
                      : Colors.error,
                  }}
                >
                  {" "}
                  {auth.currentUser?.emailVerified
                    ? "Verified"
                    : "Your email is not yet verified."}{" "}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: Colors.primary }}> {email !== null ? email : currentUserData?.email} </Text>
              </View>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
                marginTop: 25,
              }}
            >
              <View>
                <Text style={styles.title}> Phone Number </Text>
                <Text
                  style={{
                    fontSize: 12,
                    color: auth.currentUser?.emailVerified
                      ? Colors.success
                      : Colors.error,
                  }}
                >
                  {" "}
                  {auth.currentUser?.phoneNumber
                    ? "Verified"
                    : "Your number is not yet verified."}{" "}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text>
                  {" "}
                  {phoneNumber !== null
                    ? phoneNumber
                    : currentUserData?.phoneNumber}{" "}
                </Text>
                <Ionicons name="chevron-forward" size={15} color="black" />
              </View>
            </View>
            <CustomButton
              title="Save Changes"
              onPress={saveChanges}
              style={{ marginTop: 60, backgroundColor: Colors.primary }}
            />
            <CustomButton
              title="Cancel Changes"
              onPress={() => {
                router.replace("/(Authenticated)/(tabs)/Profile");
              }}
              style={{ marginTop: 5, backgroundColor: Colors.error }}
            />
          </View>
          <EditValuesPopup
            visible={editValuesModalVisible}
            onConfirm={handleConfirm}
            onClose={() => {
              setEditValuesModalVisible(false);
            }}
            valueToChange={String(valueToChange)}
          />
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
  cameraIcon: {
    position: "absolute",
    alignSelf: "center",
    top: "50%",
    transform: [{ translateY: -17.5 }], // Adjust for half the icon size
  },
  title: {
    fontWeight: "bold",
    color: Colors.secondaryText,
  },
  header: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default Personal;
