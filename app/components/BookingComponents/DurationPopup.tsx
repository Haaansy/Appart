import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface PopupProps {
  visible: boolean;
  onSelect: (duration: number) => void; // Pass selected value
  message: string;
  leaseDuration: number[];
}

const DurationPopup: React.FC<PopupProps> = ({ visible, onSelect, message, leaseDuration }) => {
  const sortedDurations = [...leaseDuration].sort((a, b) => a - b); // Sort in ascending order

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.message}>{message}</Text>
          {sortedDurations.map((duration, index) => (
            <TouchableOpacity
              key={index}
              style={styles.button}
              onPress={() => onSelect(duration)} // Pass the selected duration
            >
              <Text style={styles.buttonText}>{`${duration} Month${duration > 1 ? "s" : ""}`}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
    width: 250,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#007BFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default DurationPopup;
