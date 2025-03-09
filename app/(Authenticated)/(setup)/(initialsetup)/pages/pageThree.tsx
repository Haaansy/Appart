import CustomTextInput from "@/app/components/CustomTextInput";
import React from "react";
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { styles } from "../styles/styles";

interface PageProps {
  onValidation: (isValid: boolean) => void;
}

const PageThree: React.FC<
  PageProps & { formData: any; updateFormData: any }
> = ({ onValidation, formData, updateFormData }) => {
  // Philippine number regex: +63 followed by 9 digits
  const phoneRegex = /^\+63\s\d{3}\s\d{3}\s\d{4}$/;

  const formatPhoneNumber = (input: string) => {
    // Remove non-numeric characters except the '+' at the start
    let numbersOnly = input.replace(/\D/g, "");

    // Ensure it starts with +63
    if (!numbersOnly.startsWith("63")) {
      numbersOnly = "63" + numbersOnly;
    }

    // Limit to 12 characters (+63 plus 10 digits)
    numbersOnly = numbersOnly.slice(0, 12);

    // Format as +63 XXX XXX XXXX
    if (numbersOnly.length > 2) {
      return `+${numbersOnly.substring(0, 2)} ${numbersOnly.substring(
        2,
        5
      )} ${numbersOnly.substring(5, 8)} ${numbersOnly.substring(8, 12)}`.trim();
    }

    return `+${numbersOnly}`;
  };

  const handlePhoneChange = (key: string, value: string) => {
    const formattedNumber = formatPhoneNumber(value);
    updateFormData(key, formattedNumber);
  };

  const isValidPhoneNumber = phoneRegex.test(formData.phoneNumber);
  const isValidEmergencyNumber = phoneRegex.test(
    formData.emergentContactNumber
  );

  React.useEffect(() => {
    onValidation(
      formData.phoneNumber.trim() !== "" &&
        formData.emergencyContact.trim() !== "" &&
        formData.emergentContactNumber.trim() !== "" &&
        isValidPhoneNumber &&
        isValidEmergencyNumber
    );
  }, [
    formData.phoneNumber,
    formData.emergencyContact,
    formData.emergentContactNumber,
    isValidPhoneNumber,
    isValidEmergencyNumber,
    onValidation,
  ]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
      >
        <ScrollView 
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingHorizontal: 10
          }}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="always"
        >
          <Text style={[styles.subtext, { marginBottom: 25 }]}>
            How can we reach you?
          </Text>
          <CustomTextInput
            label="Contact Number"
            value={formData.phoneNumber}
            onChangeText={(text) => handlePhoneChange("phoneNumber", text)}
            keyboardType="numeric"
          />
          {!isValidPhoneNumber && formData.phoneNumber !== "" && (
            <Text style={{ color: "red", textAlign: "center", marginTop: 5 }}>
              Invalid format. Use +63 XXX XXX XXXX
            </Text>
          )}

          <View style={{ marginTop: 25 }}>
            <CustomTextInput
              label="Emergency Contact Person"
              value={formData.emergencyContact}
              onChangeText={(text) => updateFormData("emergencyContact", text)}
            />
            <CustomTextInput
              label="Emergency Contact Number"
              value={formData.emergentContactNumber}
              onChangeText={(text) =>
                handlePhoneChange("emergentContactNumber", text)
              }
              keyboardType="numeric"
            />
            {!isValidEmergencyNumber && formData.emergentContactNumber !== "" && (
              <Text style={{ color: "red", textAlign: "center", marginTop: 5 }}>
                Invalid format. Use +63 XXX XXX XXXX
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default PageThree;
