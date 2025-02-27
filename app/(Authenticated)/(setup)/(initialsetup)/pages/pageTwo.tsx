import DateSelector from "@/app/components/DateSelector";
import { View, Text } from "react-native";
import { styles } from "../styles/styles";
import React from "react";

interface PageProps {
  onValidation: (isValid: boolean) => void;
}

const PageTwo: React.FC<PageProps & { formData: any; updateFormData: any }> = ({
  onValidation,
  formData,
  updateFormData,
}) => {
  const birthDate = formData.birthDate || { month: "", day: "", year: "" };

  // Function to calculate age
  const calculateAge = (year: string, month: string, day: string) => {
    if (!year || !month || !day) return 0;

    const birth = new Date(Number(year), Number(month) - 1, Number(day)); // Month is 0-based
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    const dayDiff = today.getDate() - birth.getDate();

    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  const age = calculateAge(birthDate.year, birthDate.month, birthDate.day);
  const isValidAge = age >= 18;

  React.useEffect(() => {
    onValidation(
      birthDate.month.trim() !== "" &&
        birthDate.day.trim() !== "" &&
        birthDate.year.trim() !== "" &&
        isValidAge // Ensure age is 18+
    );
  }, [
    birthDate.month,
    birthDate.day,
    birthDate.year,
    isValidAge,
    onValidation,
  ]);

  const handleDateSelectioni = (date: any) => {
    updateFormData("birthDate", date);
  };

  return (
    <View>
      <Text style={styles.subtext}>When is your birthday?</Text>
      <DateSelector
        value={birthDate}
        onChange={(date) => handleDateSelectioni(date)}
      />
      {!isValidAge && (
        <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
          You must be at least 18 years old.
        </Text>
      )}
    </View>
  );
};

export default PageTwo;
