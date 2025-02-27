import React, { useState, useRef, forwardRef } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  Animated,
  TextInputProps,
  Text,
} from "react-native";
import Colors from "@/assets/styles/colors";

interface CustomTextAreaProps extends TextInputProps {
  label?: string;
  maxCharacters?: number;
}

const CustomTextArea = forwardRef<TextInput, CustomTextAreaProps>(
  ({ label, maxCharacters, value, onChangeText, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);
    const animatedLabel = useRef(new Animated.Value(value ? 1 : 0)).current;
    const [text, setText] = useState(value || "");

    const handleFocus = () => {
      setIsFocused(true);
      Animated.timing(animatedLabel, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }).start();
    };

    const handleBlur = () => {
      if (!text) {
        setIsFocused(false);
        Animated.timing(animatedLabel, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }).start();
      }
    };

    const handleTextChange = (input: string) => {
      if (!maxCharacters || input.length <= maxCharacters) {
        setText(input);
        onChangeText?.(input);
      }
    };

    const getIndicatorColor = () => {
      if (!maxCharacters) return Colors.secondaryText;
      const usage = text.length / maxCharacters;
      if (usage >= 1) return "red"; // Fully reached limit
      if (usage >= 0.9) return "orange"; // Close to limit
      return Colors.secondaryText;
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
                color: isFocused ? Colors.primary : Colors.secondaryText,
              },
            ]}
          >
            {label}
          </Animated.Text>
        )}
        <TextInput
          ref={ref}
          style={[styles.textArea, isFocused && styles.inputFocused]}
          multiline
          numberOfLines={4}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor={Colors.secondaryText}
          value={text}
          onChangeText={handleTextChange}
          {...props}
        />
        {maxCharacters && (
          <Text style={[styles.charIndicator, { color: getIndicatorColor() }]}>
            {text.length}/{maxCharacters}
          </Text>
        )}
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
  textArea: {
    width: "100%",
    minHeight: 100,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.primaryText,
    textAlignVertical: "top",
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  charIndicator: {
    textAlign: "right",
    marginTop: 5,
    fontSize: 14,
  },
});

export default CustomTextArea;
