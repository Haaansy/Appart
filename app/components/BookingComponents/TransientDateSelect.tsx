import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
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
  minimumDate?: Date;
  disablePastDates?: boolean;
}

const TransientDateSelect: React.FC<PopupProps> = ({
  visible,
  bookedDates,
  onClose,
  title,
  subtitle,
  yourbookedDates,
  onConfirm,
  minimumDate,
  disablePastDates = false
}) => {
  const [dates, setDates] = useState<Timestamp[]>([]);
  const [startDate, setStartDate] = useState<Timestamp | null>(null);
  const [endDate, setEndDate] = useState<Timestamp | null>(null);

  // Function to check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    if (!disablePastDates) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    
    return dateToCheck < today;
  };

  // Function to check if a date is already booked
  const isDateBooked = (date: Date): boolean => {
    return bookedDates.some(bookedDate => {
      const bookedDateObj = new Date(bookedDate.toDate());
      return (
        bookedDateObj.getFullYear() === date.getFullYear() &&
        bookedDateObj.getMonth() === date.getMonth() &&
        bookedDateObj.getDate() === date.getDate()
      );
    });
  };

  // Function to check if a date is valid to select
  const isDateValid = (date: Date): boolean => {
    // Check if date is before minimum date
    if (minimumDate) {
      const minDate = new Date(minimumDate);
      minDate.setHours(0, 0, 0, 0);
      
      if (date < minDate) {
        return false;
      }
    }
    
    // Check if date is in the past
    if (isPastDate(date)) {
      return false;
    }
    
    // Check if date is already booked
    if (isDateBooked(date)) {
      return false;
    }
    
    return true;
  };

  const handleDatePress = (selectedDate: string) => {
    const selectedDateObj = new Date(selectedDate);
    
    // Validate the selected date
    if (!isDateValid(selectedDateObj)) {
      if (isDateBooked(selectedDateObj)) {
        Alert.alert("Date Unavailable", "This date is already booked.");
      } else if (isPastDate(selectedDateObj)) {
        Alert.alert("Invalid Date", "You cannot select dates in the past.");
      } else {
        Alert.alert("Invalid Date", "This date is not available for booking.");
      }
      return;
    }
    
    const selectedTimestamp = Timestamp.fromDate(selectedDateObj);

    if (!startDate) {
      setStartDate(selectedTimestamp);
      setDates([selectedTimestamp]); // Initialize dates
      return;
    }

    if (startDate && !endDate) {
      // Only proceed if end date is after start date
      if (selectedTimestamp.toMillis() <= startDate.toMillis()) {
        Alert.alert("Invalid Selection", "End date must be after start date.");
        return;
      }
      
      // Check if any date in the range is already booked
      const start = startDate.toDate();
      const end = selectedDateObj;
      let current = new Date(start);
      
      while (current <= end) {
        if (!isDateValid(new Date(current))) {
          Alert.alert(
            "Invalid Range", 
            "Your selection includes dates that are unavailable or already booked."
          );
          return;
        }
        current.setDate(current.getDate() + 1);
      }
      
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
            minimumDate={minimumDate || new Date()}
            disablePastDates={disablePastDates}
          />

          <CustomButton
            onPress={() => onConfirm(dates)}
            title="Confirm Dates"
            style={{ marginTop: 20, backgroundColor: Colors.primary }}
            disabled={dates.length === 0}
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
