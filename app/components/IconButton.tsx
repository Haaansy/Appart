import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/assets/styles/colors"; // Import your colors

interface IconButtonProps {
  icon?: keyof typeof Ionicons.glyphMap; // ✅ Optional start icon
  endIcon?: keyof typeof Ionicons.glyphMap; // ✅ Optional end icon
  text?: string;
  onPress: () => void;
  iconSize?: number;
  iconColor?: string;
  textColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  width?: number | "auto";
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean; // Added the disabled prop
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  endIcon,
  text,
  onPress,
  iconSize = 24,
  iconColor = Colors.primaryText,
  textColor = Colors.primaryText,
  backgroundColor = Colors.primaryBackground,
  borderColor = Colors.border,
  borderWidth = 2,
  width = "auto",
  style,
  textStyle,
  disabled = false, // Added default value
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor, width, borderColor, borderWidth },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled} // Use the disabled prop
    >
      {/* Start Icon */}
      {icon && (
        <Ionicons
          name={icon}
          size={iconSize}
          color={iconColor}
          style={[styles.icon, text && { marginRight: 8 }]}
        />
      )}

      {/* Text */}
      {text && <Text style={[styles.text, { color: textColor }, textStyle]}>{text}</Text>}

      {/* End Icon */}
      {endIcon && (
        <Ionicons
          name={endIcon}
          size={iconSize}
          color={iconColor}
          style={[styles.icon, text && { marginLeft: 8 }]}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 15,
    borderStyle: "solid",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    marginVertical: "auto",
  },
});

export default IconButton;
