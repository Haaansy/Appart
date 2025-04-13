import { View, Text, KeyboardAvoidingView, ScrollView, Pressable, Animated } from "react-native";
import { styles } from "../styles/styles";
import React, { useState, useRef } from "react";

interface PageProps {
  onValidation: (isValid: boolean) => void;
}

const PageTwo: React.FC<PageProps & { formData: any; updateFormData: any }> = ({
  onValidation,
  formData,
  updateFormData,
}) => {
  const birthDate = formData.birthDate || { month: "", day: "", year: "" };
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [activeSelector, setActiveSelector] = useState<'month' | 'day' | 'year' | null>(null);

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
        isValidAge
    );
    
    // Animate message if age is invalid
    if (!isValidAge && birthDate.year.trim() !== "") {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [
    birthDate.month,
    birthDate.day,
    birthDate.year,
    isValidAge,
    onValidation,
  ]);

  const handleDateChange = (field: 'month' | 'day' | 'year', value: string) => {
    updateFormData("birthDate", { ...birthDate, [field]: value });
  };
  
  // Generate selectable options
  const generateMonths = () => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    return months.map((month, index) => ({
      label: month,
      value: (index + 1).toString().padStart(2, '0')
    }));
  };
  
  const generateDays = () => {
    const days = [];
    for (let i = 1; i <= 31; i++) {
      days.push({
        label: i.toString(),
        value: i.toString().padStart(2, '0')
      });
    }
    return days;
  };
  
  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 100; i <= currentYear; i++) {
      years.push({
        label: i.toString(),
        value: i.toString()
      });
    }
    return years.reverse();
  };

  const renderWheelPicker = (
    options: { label: string; value: string }[],
    selectedValue: string,
    onSelect: (value: string) => void
  ) => {
    return (
      <ScrollView
        style={{
          maxHeight: 150,
          width: 80,
          borderRadius: 10,
          backgroundColor: '#f5f5f5',
        }}
        contentContainerStyle={{ paddingVertical: 60 }}
        showsVerticalScrollIndicator={false}
        snapToInterval={40}
        decelerationRate="fast"
        onMomentumScrollEnd={(e) => {
          const y = e.nativeEvent.contentOffset.y;
          const index = Math.round(y / 40);
          if (options[index]) {
            onSelect(options[index].value);
          }
        }}
      >
        {options.map((option) => (
          <Pressable
            key={option.value}
            style={{
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: selectedValue === option.value ? '#e0e0e0' : 'transparent',
              borderRadius: 5,
            }}
            onPress={() => onSelect(option.value)}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: selectedValue === option.value ? 'bold' : 'normal',
                color: selectedValue === option.value ? '#007AFF' : '#333',
              }}
            >
              {option.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    );
  };

  return (
    <KeyboardAvoidingView>
      <Text style={styles.subtext}>When is your birthday?</Text>
      
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-around', 
        alignItems: 'center',
        marginVertical: 20,
        paddingHorizontal: 20,
      }}>
        <View>
          <Text style={{ textAlign: 'center', marginBottom: 5, color: '#666' }}>Month</Text>
          {renderWheelPicker(
            generateMonths(),
            birthDate.month,
            (value) => handleDateChange('month', value)
          )}
        </View>
        
        <View>
          <Text style={{ textAlign: 'center', marginBottom: 5, color: '#666' }}>Day</Text>
          {renderWheelPicker(
            generateDays(),
            birthDate.day,
            (value) => handleDateChange('day', value)
          )}
        </View>
        
        <View>
          <Text style={{ textAlign: 'center', marginBottom: 5, color: '#666' }}>Year</Text>
          {renderWheelPicker(
            generateYears(),
            birthDate.year,
            (value) => handleDateChange('year', value)
          )}
        </View>
      </View>
      
      <View style={{ alignItems: 'center', marginTop: 10 }}>
        {!isValidAge && birthDate.year.trim() !== "" && (
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              backgroundColor: 'rgba(255, 0, 0, 0.1)',
              padding: 10,
              borderRadius: 8,
              marginTop: 10,
            }}
          >
            <Text style={{ color: "red", textAlign: "center" }}>
              You must be at least 18 years old.
            </Text>
          </Animated.View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default PageTwo;
