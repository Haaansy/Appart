import {
  View,
  Text,
  ActivityIndicator,
  Animated,
  ScrollView,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomButton from "@/app/components/CustomButton";
import Colors from "@/assets/styles/colors"; // Adjust path if needed
import styles from "./styles/styles"; // Adjust path if needed
import PageOne from "./pages/PageOne";
import PageTwo from "./pages/PageTwo";
import PageThree from "./pages/PageThree";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { updateTransient } from "@/app/Firebase/Services/DatabaseService";
import { useTransient } from "@/app/hooks/transient/useTransient";
import { Transient } from "@/app/types/Transient";

const pages = [PageOne, PageTwo, PageThree];

const index = () => {
  const { transientId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const inputRefs = useRef<{ [key: string]: TextInput | null }>({});

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

  // Fetch apartment data
  const { transient, loading, error } = useTransient(String(transientId));

  // Form Data
  const [formData, setFormData] = useState<Transient>();

  useEffect(() => {
    if (transient) {
      setFormData(transient);
    }
  }, [transient]);

  // Prevent rendering until formData is available
  if (loading || !formData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading Transient...</Text>
      </View>
    );
  }

  const updateFormData = (key: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
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

  const handleSave = () => {
    updateTransient(String(transientId), formData)
      .then(() => {
        console.log("Transient updated successfully");
        router.replace("/(Authenticated)/(tabs)/Home");
      })
      .catch((error) => {
        console.error("Error updating transient:", error);
      });
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
            <Image
              source={require("@/assets/images/Icons/Dark-Icon.png")}
              style={styles.icon}
            />
            <Text style={styles.text}>Edit {"\n"}Transient</Text>
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
                    title={
                      step === pages.length - 1 ? "Save Changes" : "Proceed"
                    }
                    onPress={
                      step === pages.length - 1 ? handleSave : handleNext
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
