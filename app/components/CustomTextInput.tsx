import React, { useState, useRef } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Animated,
  TextInputProps,
  Text,
  TouchableOpacity,
} from "react-native";
import Colors from "@/assets/styles/colors"; // Import colors
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import icons

interface CustomTextInputProps extends TextInputProps {
  label: string;
  status?: "required" | "optional" | ""; // Status can be required, optional, or blank
  secureTextEntry?: boolean;
  textStart?: string; // Optional start text
  textEnd?: string; // Optional end text
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  status = "",
  secureTextEntry = false,
  textStart,
  textEnd,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);
  const animatedLabel = useRef(new Animated.Value(props.value ? 1 : 0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedLabel, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (!props.value) {
      setIsFocused(false);
      Animated.timing(animatedLabel, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const getStatusLabel = () => {
    if (status === "required") return " (Required)";
    if (status === "optional") return " (Optional)";
    return "";
  };

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.label,
          {
            top: animatedLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [17, -8], // Moves label up
            }),
            fontSize: animatedLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 12], // Shrinks text when focused
            }),
            color: isFocused ? Colors.primary : Colors.secondaryText,
          },
        ]}
      >
        {label}
        <Text style={styles.statusText}>{getStatusLabel()}</Text>
      </Animated.Text>
      <View style={styles.inputContainer}>
        {textStart && <Text style={styles.textStart}>{textStart}</Text>}
        <TextInput
          style={[
            styles.input,
            isFocused && styles.inputFocused,
            textStart && styles.inputWithStartText,
            textEnd && styles.inputWithEndText,
          ]}
          secureTextEntry={!isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.secondaryText}
          {...props}
        />
        {textEnd && <Text style={styles.textEnd}>{textEnd}</Text>}
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? "eye-off" : "eye"}
              size={24}
              color={Colors.secondaryText}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
    position: "relative",
  },
  label: {
    position: "absolute",
    left: 15,
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: 5,
    zIndex: 10,
  },
  statusText: {
    fontSize: 12,
    color: Colors.secondaryText,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: 15,
  },
  textStart: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: Colors.primaryText,
  },
  inputWithStartText: {
    paddingLeft: 5, // Ensures textStart doesn't overlap input
  },
  inputWithEndText: {
    paddingRight: 5, // Ensures textEnd doesn't overlap input
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  textEnd: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginLeft: 8,
  },
  iconContainer: {
    padding: 10,
  },
});

export default CustomTextInput;
