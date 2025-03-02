import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomCalendar from "../CustomCalendar";
import { Timestamp } from "firebase/firestore";
import Colors from "@/assets/styles/colors";

interface PopupProps {
  visible: boolean;
  onSelect: (date: number) => void; // Pass selected value
  viewingDates?: Timestamp[];
  bookedDates: Timestamp[];
  yourbookedDates?: Timestamp[];
  onClose: () => void;
  title: string;
  subtitle: string;
}

const DateSelectPopup: React.FC<PopupProps> = ({
  visible,
  onSelect,
  viewingDates,
  bookedDates,
  onClose,
  title,
  subtitle,
  yourbookedDates,
}) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => onClose()}>
              <Ionicons
                name={"chevron-back"}
                size={30}
                color="black"
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 15,
              marginLeft: 10,
            }}
          >
            <View
              style={{
                backgroundColor: Colors.error,
                width: 15,
                height: 15,
                borderRadius: 15,
              }}
            />
            <Text style={styles.subtitle}> - Booked Dates</Text>
          </View>
          {yourbookedDates && (
              <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                marginLeft: 10,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.success,
                  width: 15,
                  height: 15,
                  borderRadius: 15,
                }}
              />
              <Text style={styles.subtitle}> - Your Booked Dates</Text>
            </View>
            )}
          <CustomCalendar
            bookedDates={bookedDates}
            viewingDates={viewingDates}
            onDatePress={(date) => onSelect(new Date(date).getTime())}
            yourbookedDates={yourbookedDates}
          />
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
    width: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "semibold",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
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

export default DateSelectPopup;
