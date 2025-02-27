import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle, View } from "react-native";

// Define props interface
interface BadgeProps {
  title: string;
  onPress?: () => void; // ✅ Now optional
  icon?: keyof typeof Ionicons.glyphMap; // ✅ Optional icon prop
  style?: ViewStyle | ViewStyle[];
}

// Functional component with typed props
const CustomBadge: React.FC<BadgeProps> = ({ title, onPress, icon, style }) => {
  return (
    <View style={[styles.button, style]}>
      <Text style={styles.text}>{title}</Text>
      {onPress && (
        <TouchableOpacity onPress={onPress}>
          <Ionicons name={icon} size={18} color="white"/>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "blue",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  }
});

export default CustomBadge;
