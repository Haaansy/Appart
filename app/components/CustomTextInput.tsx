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
  secureTextEntry?: boolean;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  label,
  secureTextEntry = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry); // Toggle state
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
      </Animated.Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, isFocused && styles.inputFocused]}
          secureTextEntry={!isPasswordVisible}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.secondaryText}
          {...props}
        />
        {secureTextEntry && (
          <TouchableOpacity
            style={styles.iconContainer}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Icon
              name={isPasswordVisible ? "eye-off" : "eye"} // Toggle eye icon
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    backgroundColor: Colors.primaryBackground,
    paddingRight: 15, // Space for icon
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
    color: Colors.primaryText,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  iconContainer: {
    padding: 10,
  },
});

export default CustomTextInput;
