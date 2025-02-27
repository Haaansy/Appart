import CustomTextInput from "@/app/components/CustomTextInput";
import { useEffect } from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/styles";
import React from "react";

interface PageProps {
  onValidation: (isValid: boolean) => void;
}

const PageOne: React.FC<PageProps & { formData: any; updateFormData: any }> = ({
  formData,
  updateFormData,
  onValidation
}) => {
  const displayName = formData.displayName || "";
  const [charCount, setCharCount] = React.useState(displayName.length);

  const handleInputChange = (text: string) => {
    // Remove spaces and keep only alphanumeric characters
    const sanitizedText = text.replace(/[^a-zA-Z0-9]/g, "");

    if (sanitizedText.length <= 12) {
      setCharCount(sanitizedText.length);
      updateFormData("displayName", sanitizedText);
    }
  };

  useEffect(() => {
    const isValid = displayName.length > 0;
    onValidation(isValid);
  },[displayName, onValidation]);

  return (
    <View>
      <Text style={styles.subtext}>What should we call you?</Text>
      <CustomTextInput
        label="Display Name"
        value={displayName}
        onChangeText={handleInputChange}
        maxLength={12}
      />
      <Text style={{ color: "gray", marginBottom: 15, textAlign: "right" }}>
        {charCount}/12
      </Text>
    </View>
  );
};

export default PageOne;