import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/assets/styles/colors";
import CustomInputWithButton from "@/app/components/CustomInputButton";
import CustomBadge from "@/app/components/CustomBadge";
import CustomDropdown from "@/app/components/CustomDropDown";

interface PageProps {
  onValidation: (isValid: boolean) => void;
  formData: any;
  updateFormData: (key: string, value: any) => void;
  inputRefs: React.MutableRefObject<{ [key: string]: TextInput | null }>;
  onInputFocus: (key: string) => void;
  onBack: () => void;
}

const PageThree: React.FC<PageProps> = ({
  onValidation,
  formData,
  updateFormData,
  inputRefs,
  onInputFocus,
  onBack,
}) => {
  const [houseRulesList, setHouseRulesList] = useState<string[]>(formData.houseRules || []);
  const [houseRulesInput, setHouseRulesInput] = useState<string>("");
  
  // Requirements list
  const [requirementsList, setRequirementsList] = useState<string[]>([]);
  const [requirementOption, setRequirementOption] = useState<string[]>([
    "Verified Account",
    "Male",
    "Female",
  ]);

  // Handle adding a new house rule
  const handleAddTag = () => {
    if (houseRulesInput.trim() && !houseRulesList.includes(houseRulesInput.trim())) {
      const newTagsList = [...houseRulesList, houseRulesInput.trim()];
      setHouseRulesList(newTagsList);
      updateFormData("houseRules", newTagsList);
      setTimeout(() => setHouseRulesInput(""), 0);
    }
  };

  // Handle removing a house rule
  const handleRemoveTag = (ruleToRemove: string) => {
    const newTagsList = houseRulesList.filter((rule) => rule !== ruleToRemove);
    setHouseRulesList(newTagsList);
    updateFormData("houseRules", newTagsList);
  };

  // Handle selecting a requirement
  const handleSelectRequirement = (requirement: string) => {
    if (!requirementsList.includes(requirement)) {
      const newRequirementsList = [...requirementsList, requirement];
      setRequirementsList(newRequirementsList);
      updateFormData("requirements", newRequirementsList);
      setRequirementOption(requirementOption.filter((item) => item !== requirement));
    }
  };

  // Handle removing a requirement
  const handleRemoveRequirement = (requirement: string) => {
    const newRequirementsList = requirementsList.filter((item) => item !== requirement);
    setRequirementsList(newRequirementsList);
    updateFormData("requirements", newRequirementsList);
    setRequirementOption([...requirementOption, requirement]); // Add back to dropdown
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack}>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
          <Ionicons name="chevron-back-outline" size={40} color={Colors.primaryText} />
          <Text style={{ fontSize: 24, fontWeight: "bold" }}> Set Rules & Requirements </Text>
        </View>
      </TouchableOpacity>

      {/* House Rules Section */}
      <View style={{ marginVertical: 25 }}>
        <Text style={styles.sectionTitle}>House Rules (Optional)</Text>
        <Text style={styles.sectionSubtitle}>
          List any important house rules tenants must follow, such as pet policies, smoking restrictions, or noise levels.
        </Text>
        <CustomInputWithButton
          buttonTitle={"+"}
          value={houseRulesInput}
          onChangeText={setHouseRulesInput}
          onButtonPress={handleAddTag}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          {houseRulesList.map((rule, index) => (
            <CustomBadge
              key={index}
              title={rule}
              icon="close"
              onPress={() => handleRemoveTag(rule)}
              style={{ backgroundColor: Colors.primary, margin: 5}}
            />
          ))}
        </View>
      </View>

      {/* Requirements Section */}
      <View style={{ marginVertical: 25 }}>
        <Text style={styles.sectionTitle}>Requirements (Optional)</Text>
        <Text style={styles.sectionSubtitle}>
          Specify any requirements for tenants, such as gender preferences or account verification.
        </Text>
        <CustomDropdown
          label={"Requirement"}
          options={requirementOption}
          onSelect={handleSelectRequirement}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          {requirementsList.map((requirement, index) => (
            <CustomBadge
              key={index}
              title={requirement}
              icon="close"
              onPress={() => handleRemoveRequirement(requirement)}
              style={{ backgroundColor: Colors.primary, margin: 5}}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.secondaryText,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: "500",
    color: Colors.secondaryText,
    marginLeft: 5,
  },
});

export default PageThree;
