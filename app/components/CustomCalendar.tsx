import Colors from "@/assets/styles/colors";
import { Timestamp } from "firebase/firestore";
import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

interface CustomCalendarProps {
  bookedDates?: Timestamp[];
  viewingDates?: Timestamp[];
  yourbookedDates?: Timestamp[];
  onDatePress?: (date: string) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  bookedDates,
  viewingDates,
  onDatePress,
  yourbookedDates,
}) => {

  console.log(bookedDates);
  console.log(viewingDates);
  console.log(yourbookedDates);
  // Convert Firestore timestamps to calendar-marked dates
  const getMarkedDates = () => {
    const markedDates: { 
      [key: string]: { selected?: boolean; marked?: boolean; dotColor?: string; selectedColor?: string } 
    } = {};

    // Helper function to add markings
    const markDate = (date: string, color: string) => {
      if (markedDates[date]) {
        markedDates[date] = { 
          ...markedDates[date], 
          marked: true, 
          dotColor: color 
        };
      } else {
        markedDates[date] = { selected: true, selectedColor: color };
      }
    };

    // Mark bookedDates
    bookedDates?.forEach((timestamp) => {
      if (timestamp instanceof Timestamp) {
        markDate(timestamp.toDate().toISOString().split("T")[0], Colors.error);
      }
    });

    // Mark yourbookedDates
    yourbookedDates?.forEach((timestamp) => {
      if (timestamp instanceof Timestamp) {
        markDate(timestamp.toDate().toISOString().split("T")[0], Colors.success);
      }
    });

    // Mark viewingDates
    viewingDates?.forEach((timestamp) => {
      if (timestamp instanceof Timestamp) {
        markDate(timestamp.toDate().toISOString().split("T")[0], Colors.info);
      }
    });

    console.log(markedDates);
    return markedDates;
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: DateData) => onDatePress?.(day.dateString)}
        markedDates={getMarkedDates()} // Now includes bookedDates, yourbookedDates, and viewingDates
        theme={{
          selectedDayBackgroundColor: "#007BFF",
          todayTextColor: "#FF5733",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default CustomCalendar;
