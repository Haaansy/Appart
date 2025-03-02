import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface CustomPickerProps {
  options: { label: string; value: any }[]; // Options for the picker
  selectedValue: string; // Currently selected value
  onSelect: (value: string) => void; // Callback when an option is selected
}

const CustomPicker: React.FC<CustomPickerProps> = ({ options, selectedValue, onSelect }) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={(itemValue) => onSelect(itemValue)}
        style={styles.picker}
      >
        {options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
});

export default CustomPicker;
