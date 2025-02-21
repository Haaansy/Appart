import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle } from "react-native";

// Define props interface
interface ButtonProps {
  title: string; // Explicitly define 'title' as a string
  onPress: () => void; // 'onPress' should be a function
  style?: ViewStyle | ViewStyle[]; // Optional style prop
}

// Functional component with typed props
const CustomButton: React.FC<ButtonProps> = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    button: {
        height: 50, // Fixed height
        backgroundColor: "blue",
        borderRadius: 15, // Rounded corners
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default CustomButton;
