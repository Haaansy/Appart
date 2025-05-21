import React, { useState, useRef, useEffect } from "react";
import {
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  Text,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "@/app/components/CustomButton";
import PageOne from "./pages/PageOne";
import styles from "./styles/styles";
import Colors from "@/assets/styles/colors";
import PageTwo from "./pages/PageTwo";
import PageThree from "./pages/PageThree";
import PageFour from "./pages/PageFour";
import { createApartment } from "@/app/Firebase/Services/DatabaseService";
import UserData from "@/app/types/UserData";
import Apartment from "@/app/types/Apartment";
import { Ionicons } from "@expo/vector-icons";
import getCurrentUserData from "@/app/hooks/users/getCurrentUserData";

const pages = [PageOne, PageTwo, PageThree, PageFour];

const index = () => {
  const [currentUserData, setCurrentUserData] = useState<UserData | null>(null);
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [formData, setFormData] = useState<Apartment>({
    images: [],
    title: "",
    status: "Available",
    address: "",
    coordinates: [],
    price: 0,
    securityDeposit: 0,
    description: "",
    tags: [],
    bedRooms: 0,
    bathRooms: 0,
    kitchen: 0,
    livingRooms: 0,
    parking: 0,
    area: 0,
    levels: 0,
    maxTenants: 0,
    electricIncluded: false,
    waterIncluded: false,
    internetIncluded: false,
    houseRules: [],
    requirements: [],
    leaseTerms: [],
    createdAt: Date.now(),
    id: undefined,
    bookedDates: [],
    viewingDates: [],
    reviews: [],
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});
  const [isLoading, setIsLoading] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        AsyncStorage.removeItem("uploadedImages")
          .then(() => console.log("Uploaded images cleared from AsyncStorage"))
          .catch((error) =>
            console.error("Error clearing uploaded images:", error)
          );
      };
    }, [])
  );

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getCurrentUserData();
      setCurrentUserData(userData);
      setFormData;
    };

    fetchUserData();
  }, []);

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev, [key]: value };
      console.log(isValid);
      console.log(updatedFormData);
      return updatedFormData;
    });
  };

  const handleNext = () => {
    if (step < pages.length - 1) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setStep(step + 1);
        fadeAnim.setValue(1);
      });
    }
  };

  const handleBack = () => {
    if (step > 0) {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setStep(step - 1);
        fadeAnim.setValue(1);
      });
    }
  };

  const handlePublish = async () => {
    setIsLoading(true);
    if (!currentUserData) {
      console.error("Current user is null. Cannot publish apartment.");
      Alert.alert("Error", "User data is missing. Please try again.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("Publishing apartment with data:", formData);

      const newApartmentID = await createApartment(formData);

      if (newApartmentID) {
        setIsLoading(false);
        console.log("New apartment created with ID:", newApartmentID);
        router.push(`/(Authenticated)/(tabs)/Home`);
      } else {
        setIsLoading(false);
        console.error("Failed to create an apartment");
        Alert.alert(
          "Error",
          "Failed to create an apartment. Please try again."
        );
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error during apartment creation:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
    }
  };

  const onInputFocus = (key: string) => {
    const input = inputRefs.current[key];
    if (input && scrollViewRef.current) {
      setTimeout(() => {
        input.measureLayout(scrollViewRef.current as any, (_x, y) => {
          scrollViewRef.current?.scrollTo({ y: y - 50, animated: true });
        });
      }, 300);
    }
  };

  const CurrentPage = pages[step];

  if (isLoading || !currentUserData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={[
          styles.backgroundVector,
          { position: "absolute", width: "100%", height: "100%" },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingHorizontal: 25,
          }}
        >
          <View style={styles.titleContainer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons
                name="chevron-back"
                size={40}
                color={Colors.primaryBackground}
              />
            </TouchableOpacity>
            <Text style={styles.text}>Add a {"\n"} New Apartment</Text>
          </View>

          <Animated.View style={{ opacity: fadeAnim, flex: 1, marginTop: 20 }}>
            <View
              style={{
                backgroundColor: Colors.primaryBackground,
                borderRadius: 20,
                padding: 15,
                paddingVertical: 25,
                flex: 1,
              }}
            >
              <View style={styles.stepIndicatorContainer}>
                {pages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.stepIndicator,
                      {
                        backgroundColor:
                          index === step ? Colors.primary : Colors.border,
                      },
                    ]}
                  />
                ))}
              </View>
              <ScrollView
                ref={scrollViewRef}
                keyboardShouldPersistTaps="handled"
              >
                <View>
                  <CurrentPage
                    formData={formData}
                    updateFormData={updateFormData}
                    onValidation={setIsValid}
                    inputRefs={inputRefs}
                    onInputFocus={onInputFocus}
                    onBack={handleBack}
                  />
                  <CustomButton
                    title={step === pages.length - 1 ? "Publish" : "Proceed"}
                    onPress={
                      step === pages.length - 1 ? handlePublish : handleNext
                    }
                    disabled={!isValid}
                  />
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default index;
