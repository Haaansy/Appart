import React, { useRef, forwardRef, useEffect } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Animated,
  TextInputProps,
  Text,
  TouchableOpacity,
} from "react-native";
import Colors from "@/assets/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

interface CustomInputWithButtonProps extends TextInputProps {
  label?: string;
  buttonTitle?: string;
  onButtonPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap; // Optional Ionicon name
}

const CustomInputWithButton = forwardRef<TextInput, CustomInputWithButtonProps>(
  ({ label, buttonTitle, onButtonPress, iconName, value, onChangeText, ...props }, ref) => {
    const isFocused = useRef(false);
    const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
      Animated.timing(animatedLabel, {
        toValue: value ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }, [value]);

    const handleFocus = () => {
      isFocused.current = true;
      Animated.timing(animatedLabel, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const handleBlur = () => {
      isFocused.current = false;
      if (!value) {
        Animated.timing(animatedLabel, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    };

    return (
      <View style={styles.container}>
        {label && (
          <Animated.Text
            style={[
              styles.label,
              {
                top: animatedLabel.interpolate({
                  inputRange: [0, 1],
                  outputRange: [17, -8],
                }),
                fontSize: animatedLabel.interpolate({
                  inputRange: [0, 1],
                  outputRange: [16, 12],
                }),
                color: isFocused.current ? Colors.primary : Colors.secondaryText,
              },
            ]}
          >
            {label}
          </Animated.Text>
        )}
        <View style={styles.inputContainer}>
          <TextInput
            ref={ref}
            style={[styles.textInput, isFocused.current && styles.inputFocused]}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholderTextColor={Colors.secondaryText}
            value={value}
            onChangeText={onChangeText}
            {...props}
          />
          <TouchableOpacity style={styles.button} onPress={onButtonPress}>
            {iconName && <Ionicons name={iconName} size={20} color="white"/>}
            {buttonTitle && <Text style={styles.buttonText}>{buttonTitle}</Text>}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: 10,
  },
  textInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.primaryText,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginLeft: 10,
    flexWrap: "wrap", // Allows wrapping content inside the button
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
    flexShrink: 1, // Ensures text wraps instead of getting cut off
  },
});


export default CustomInputWithButton;
