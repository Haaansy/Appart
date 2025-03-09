import Tenant from "@/app/types/Tenant";
import Colors from "@/assets/styles/colors";
import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import CustomInputWithButton from "../CustomInputButton";
import { fetchTenantByDisplayName } from "@/app/Firebase/Services/DatabaseService";
import { useFocusEffect } from "expo-router";
import CustomTextInput from "../CustomTextInput";
import CustomButton from "../CustomButton";

interface EditValuesProps {
  visible: boolean;
  onConfirm: (value: string) => void; // Pass selected value
  onClose: () => void;
  valueToChange: string;
}

const EditValuesPopup: React.FC<EditValuesProps> = ({
  visible,
  onConfirm,
  onClose,
  valueToChange,
}) => {
  const [value, setValue] = React.useState<string>("");
  const [isVisible, setIsVisible] = React.useState<boolean>(visible);
  const nameRegex = /^[A-Za-z]+$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\+63 \d{3} \d{3} \d{4}$/;

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleChangeText = (text: string) => {
    if (valueToChange === "Phone Number") {
      // Remove all non-digit characters
      let cleaned = text.replace(/\D/g, "");

      // Add country code if not present
      if (!cleaned.startsWith("63")) {
        cleaned = "63" + cleaned;
      }

      // Format the number
      let formatted = "+63 ";
      if (cleaned.length > 2) {
        formatted += cleaned.slice(2, 5) + " ";
      }
      if (cleaned.length > 5) {
        formatted += cleaned.slice(5, 8) + " ";
      }
      if (cleaned.length > 8) {
        formatted += cleaned.slice(8, 12);
      }

      setValue(formatted);
    } else {
      setValue(text);
    }
  };

  const handleConfirm = () => {
    if (
      (valueToChange === "First Name" || valueToChange === "Last Name") &&
      !nameRegex.test(value)
    ) {
      alert("Invalid name. Only alphabets are allowed.");
      return;
    } else if (valueToChange === "Email Address" && !emailRegex.test(value)) {
      alert("Invalid email address.");
      return;
    } else if (valueToChange === "Phone Number" && !phoneRegex.test(value)) {
      alert("Invalid phone number. Format should be +63 xxx xxx xxxx.");
      return;
    }
    setValue("");
    onConfirm(value);
  };

  const handleClose = () => {
    setValue("");
    setIsVisible(false);
    onClose();
  };

  return (
    <Modal transparent={true} visible={isVisible} animationType="fade">
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={styles.overlay}>
          <View style={styles.popup}>
            <Text style={styles.message}>Edit {valueToChange}</Text>
            <Text style={styles.submessage}>
              Update your {valueToChange} here.
            </Text>
            {/* Add input field and buttons here */}
            {(valueToChange === "First Name" ||
              valueToChange === "Last Name" ||
              valueToChange === "Email Address" ||
              valueToChange === "Phone Number") && (
              <CustomTextInput
                label={valueToChange}
                value={value}
                onChangeText={handleChangeText}
                keyboardType={valueToChange === "Phone Number" ? "number-pad" : "default"}
              />
            )}
            <CustomButton
              onPress={handleConfirm}
              title={"Confirm"}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  message: {
    fontSize: 28,
    fontWeight: "semibold",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "40%",
  },
  cancelButton: {
    marginTop: 10,
    borderColor: Colors.error,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "40%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  submessage: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
});

export default EditValuesPopup;
