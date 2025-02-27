import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CustomAddDropdownProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (option: "transient" | "apartment") => void;
}

const CustomAddDropdown: React.FC<CustomAddDropdownProps> = ({
  visible,
  onClose,
  onSelect,
}) => {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.dropdown}>
          {/* Add Transient */}
          <TouchableOpacity style={styles.option} onPress={() => onSelect("transient")}>
            <Ionicons name="bed-outline" size={20} color="black" style={styles.icon} />
            <Text style={styles.text}>Add Transient</Text>
          </TouchableOpacity>

          {/* Add Apartment */}
          <TouchableOpacity style={styles.option} onPress={() => onSelect("apartment")}>
            <Ionicons name="business-outline" size={20} color="black" style={styles.icon} />
            <Text style={styles.text}>Add Apartment</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.3)", // Slight dark overlay
  },
  dropdown: {
    backgroundColor: "white",
    borderRadius: 25,
    paddingVertical: 10,
    width: 250,
    elevation: 5, // Shadow effect for Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  icon: {
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    color: "black",
  },
});

export default CustomAddDropdown;
