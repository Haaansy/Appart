import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/assets/styles/colors";
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

const PageFour: React.FC<PageProps> = ({
  formData,
  updateFormData,
  onBack,
  onValidation
}) => {
  const [leaseList, setLeaseList] = useState<number[]>(formData.leaseTerms || []);
  const [leaseOptions, setLeaseOptions] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

  useEffect(() => {
    const isValid = leaseList.length > 0;
    onValidation(isValid);
  }, [leaseList, onValidation])

  // Format lease term correctly (singular/plural)
  const formatLeaseTerm = (num: number) => `${num} month${num > 1 ? "s" : ""}`;

  // Handle selecting multiple lease terms
  const handleMultiSelectLeaseTerms = (selected: string[]) => {
    // selected is array of formatted strings, e.g. ["1 month", "3 months"]
    const selectedNumbers = selected.map((s) => parseInt(s.split(" ")[0], 10));
    setLeaseList(selectedNumbers);
    updateFormData("leaseTerms", selectedNumbers);
    setLeaseOptions(
      [1,2,3,4,5,6,7,8,9,10,11,12].filter((item) => !selectedNumbers.includes(item))
    );
  };

  // Handle removing a lease term (still allow badge removal)
  const handleRemoveLeaseTerm = (term: number) => {
    const updatedLeaseList = leaseList.filter((item) => item !== term);
    setLeaseList(updatedLeaseList);
    updateFormData("leaseTerms", updatedLeaseList);
    setLeaseOptions(
      [1,2,3,4,5,6,7,8,9,10,11,12].filter((item) => !updatedLeaseList.includes(item))
    );
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={onBack}>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}>
          <Ionicons name="chevron-back-outline" size={40} color={Colors.primaryText} />
          <Text style={{ fontSize: 22, fontWeight: "bold" }}> Set Supported Lease Terms </Text>
        </View>
      </TouchableOpacity>

      {/* Lease Terms Section */}
      <View style={{ marginVertical: 25 }}>
        <Text style={styles.sectionTitle}>Supported Lease Terms</Text>
        <Text style={styles.sectionSubtitle}>
          Indicate supported lease durations. Select all that apply.
        </Text>
        <CustomDropdown
          label="Lease Terms"
          options={[1,2,3,4,5,6,7,8,9,10,11,12].map(formatLeaseTerm)}
          multiSelect
          selected={leaseList.map(formatLeaseTerm)}
          onMultiSelect={handleMultiSelectLeaseTerms}
        />
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          {leaseList.map((term, index) => (
            <CustomBadge
              key={index}
              title={formatLeaseTerm(term)}
              icon="close"
              onPress={() => handleRemoveLeaseTerm(term)}
              style={{ backgroundColor: Colors.primary, margin: 5 }}
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

export default PageFour;
