import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomCalendar from "../CustomCalendar";
import { Timestamp } from "firebase/firestore";
import Colors from "@/assets/styles/colors";
import CustomButton from "../CustomButton";
import { BookingDate } from "@/app/types/BookedDates";

interface PopupProps {
  visible: boolean;
  bookedDates: Timestamp[];
  yourbookedDates?: Timestamp[];
  onClose: () => void;
  title: string;
  subtitle: string;
  onConfirm: (dates: Timestamp[]) => void;
}

const TransientDateSelect: React.FC<PopupProps> = ({
  visible,
  bookedDates,
  onClose,
  title,
  subtitle,
  yourbookedDates,
  onConfirm
}) => {
  const [dates, setDates] = useState<Timestamp[]>([]);
  const [startDate, setStartDate] = useState<Timestamp | null>(null);
  const [endDate, setEndDate] = useState<Timestamp | null>(null);

  const handleDatePress = (selectedDate: string) => {
    const selectedTimestamp = Timestamp.fromDate(new Date(selectedDate));

    if (!startDate) {
      setStartDate(selectedTimestamp);
      setDates([selectedTimestamp]); // Initialize dates
      return;
    }

    if (startDate && !endDate) {
      setEndDate(selectedTimestamp);
      generateTimestampsBetween(startDate, selectedTimestamp);
      return;
    }

    if (startDate && endDate) {
      setStartDate(selectedTimestamp);
      setEndDate(null);
      setDates([selectedTimestamp]); // Reset with the new start date
    }
  };

  const generateTimestampsBetween = (start: Timestamp, end: Timestamp) => {
    let current = start.toMillis();
    const endMillis = end.toMillis();
    const dayMillis = 24 * 60 * 60 * 1000; // One day in milliseconds
    const timestamps: Timestamp[] = [];

    while (current <= endMillis) {
      timestamps.push(Timestamp.fromMillis(current));
      current += dayMillis;
    }

    setDates(timestamps);
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="chevron-back"
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

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View
              style={[styles.legendBox, { backgroundColor: Colors.error }]}
            />
            <Text style={styles.subtitle}> - Booked Dates</Text>
          </View>

          {yourbookedDates && (
            <View style={styles.legendContainer}>
              <View
                style={[styles.legendBox, { backgroundColor: Colors.success }]}
              />
              <Text style={styles.subtitle}> - Your Booked Dates</Text>
            </View>
          )}

          <CustomCalendar
            bookedDates={bookedDates}
            onDatePress={handleDatePress} // Passes the selected date
            yourbookedDates={dates}
          />

          <CustomButton
            onPress={() => onConfirm(dates)}
            title="Confirm Dates"
            style={{ marginTop: 20, backgroundColor: Colors.primary }}
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
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  legendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginLeft: 10,
  },
  legendBox: {
    width: 15,
    height: 15,
    borderRadius: 15,
  },
});

export default TransientDateSelect;
