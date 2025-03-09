import CustomDropdown from "@/app/components/CustomDropDown";
import CustomTextInput from "@/app/components/CustomTextInput";
import React from "react";
import { View, Text, KeyboardAvoidingView, ScrollView } from "react-native";
import { styles } from "../styles/styles";

interface PageProps {
  onValidation: (isValid: boolean) => void;
}

const PageOne: React.FC<PageProps & { formData: any; updateFormData: any }> = ({
  onValidation,
  formData,
  updateFormData,
}) => {
  React.useEffect(() => {
    onValidation(
      formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.sex.trim() !== ""
    );
  }, [formData.firstName, formData.lastName, onValidation]);

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <Text style={styles.subtext}>What's your name?</Text>
        <CustomTextInput
          label="First Name"
          value={formData.firstName}
          onChangeText={(text) => updateFormData("firstName", text)}
        />
        <CustomTextInput
          label="Last Name"
          value={formData.lastName}
          onChangeText={(text) => updateFormData("lastName", text)}
        />
        <CustomDropdown
          label="Sex"
          options={["Male", "Female"]}
          selectedValue={formData.sex}
          onSelect={(value) => updateFormData("sex", value)}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PageOne;
