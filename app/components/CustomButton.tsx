import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";

// Define props interface
interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  disabled?: boolean; // Added disabled prop
  textstyle?: TextStyle | TextStyle[]; // Optional style for text
}

// Functional component with typed props
const CustomButton: React.FC<ButtonProps> = ({ title, onPress, style, disabled = false, textstyle}) => {
  return (
    <TouchableOpacity
      onPress={!disabled ? onPress : undefined} // Prevents press if disabled
      style={[styles.button, disabled && styles.disabledButton, style]}
      activeOpacity={disabled ? 1 : 0.7} // No feedback if disabled
    >
      <Text style={[styles.text, disabled && styles.disabledText, textstyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 50,
    backgroundColor: "blue",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25
  },
  disabledButton: {
    backgroundColor: "gray", // Disabled style
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledText: {
    color: "#ccc", // Faded text when disabled
  },
});

export default CustomButton;
