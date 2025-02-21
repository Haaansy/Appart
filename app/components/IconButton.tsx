import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import Colors from "@/assets/styles/colors"; // Import your colors

interface IconButtonProps {
  icon: string;
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
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
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
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} style={{marginRight: text ? 8 : 0,}} />
      {text && <Text style={[styles.text, { color: textColor }, textStyle]}>{text}</Text>}
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
});

export default IconButton;
