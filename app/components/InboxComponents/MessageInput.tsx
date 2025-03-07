import React, { useRef, forwardRef, useEffect, useState } from "react";
import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import Colors from "@/assets/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

interface MessageInputProps extends TextInputProps {
  onSend: () => void;
}

const MessageInput = forwardRef<TextInput, MessageInputProps>(
  ({ value, onChangeText, onSend, ...props }, ref) => {
    const [inputHeight, setInputHeight] = useState(40); // Dynamic height

    return (
      <View style={styles.inputContainer}>
        <TextInput
          ref={ref}
          style={[styles.textInput, { height: Math.max(40, inputHeight) }]}
          placeholder="Type a message..."
          placeholderTextColor={Colors.secondaryText}
          value={value}
          onChangeText={onChangeText}
          multiline // Enables multi-line input
          onContentSizeChange={(event) =>
            setInputHeight(event.nativeEvent.contentSize.height)
          } // Adjusts height dynamically
          {...props}
        />
        <TouchableOpacity style={styles.sendButton} onPress={onSend} disabled={!value?.trim()}>
          <Ionicons
            name="send"
            size={24}
            color={value?.trim() ? Colors.primary : Colors.secondaryText}
          />
        </TouchableOpacity>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 25,
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: 15,
    paddingVertical: 8,
    margin: 10,
    minHeight: 40,
    maxHeight: 120, // Prevents excessive expansion
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.primaryText,
    paddingVertical: 10,
  },
  sendButton: {
    marginLeft: 10,
    padding: 5,
  },
});

export default MessageInput;
