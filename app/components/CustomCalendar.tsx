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
  minimumDate?: Date; // New optional prop for minimum selectable date
  disablePastDates?: boolean; // New optional prop to disable past dates
}

// Define a more specific type for marked dates to include the disableTouchEvent property
interface MarkedDateProps {
  selected?: boolean;
  marked?: boolean;
  dotColor?: string;
  selectedColor?: string;
  disabled?: boolean;
  disableTouchEvent?: boolean; // Required for completely disabling interaction with specific dates
  // Add period styling properties
  startingDay?: boolean;
  endingDay?: boolean;
  color?: string;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({
  bookedDates,
  viewingDates,
  onDatePress,
  yourbookedDates,
  minimumDate,
  disablePastDates = false,
}) => {

  // Convert Firestore timestamps to calendar-marked dates
  const getMarkedDates = () => {
    const markedDates: { 
      [key: string]: MarkedDateProps 
    } = {};

    // Process date arrays to identify and mark periods
    const processDates = (dates: Timestamp[] | undefined, color: string, isBooked: boolean = false) => {
      if (!dates?.length) return;
      
      // Sort dates chronologically
      const sortedDates = dates.map(ts => ts.toDate()).sort((a, b) => a.getTime() - b.getTime());
      
      // Convert to string format and handle individual dates
      const dateStrings = sortedDates.map(date => date.toISOString().split('T')[0]);
      
      for (let i = 0; i < dateStrings.length; i++) {
        const current = dateStrings[i];
        const prev = i > 0 ? dateStrings[i-1] : null;
        const next = i < dateStrings.length - 1 ? dateStrings[i+1] : null;
        
        // Check if date is part of a sequence
        const isPrevConsecutive = prev && new Date(current).getTime() - new Date(prev).getTime() === 86400000;
        const isNextConsecutive = next && new Date(next).getTime() - new Date(current).getTime() === 86400000;
        
        markedDates[current] = {
          ...(markedDates[current] || {}),
          color: color,
          disabled: isBooked,
          disableTouchEvent: isBooked,
        };
        
        // Apply period styling
        if (!isPrevConsecutive && isNextConsecutive) {
          // Start of period
          markedDates[current].startingDay = true;
        } else if (isPrevConsecutive && !isNextConsecutive) {
          // End of period
          markedDates[current].endingDay = true;
        } else if (!isPrevConsecutive && !isNextConsecutive) {
          // Single day (both start and end)
          markedDates[current].startingDay = true;
          markedDates[current].endingDay = true;
        }
      }
    };

    // Process different types of dates
    processDates(bookedDates, Colors.error, true);
    processDates(yourbookedDates, Colors.success);
    processDates(viewingDates, Colors.info);

    // If disablePastDates is true, mark past dates as disabled
    if (disablePastDates) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Disable all dates before today
      for (let d = new Date(2020, 0, 1); d < today; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split("T")[0];
        markedDates[dateString] = { 
          ...markedDates[dateString], 
          disabled: true,
          disableTouchEvent: true
        };
      }
    }
    
    return markedDates;
  };

  // Format the minimum date for the calendar
  const minDate = disablePastDates && !minimumDate ? 
    new Date().toISOString().split("T")[0] : 
    minimumDate ? minimumDate.toISOString().split("T")[0] : 
    undefined;

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day: DateData) => onDatePress?.(day.dateString)}
        markedDates={getMarkedDates()}
        markingType="period"
        minDate={minDate}
        disableAllTouchEventsForDisabledDays={true}
        theme={{
          selectedDayBackgroundColor: "#007BFF",
          todayTextColor: "#FF5733",
          textDisabledColor: '#d9e1e8',
          // Add theme properties for period styling
          'stylesheet.day.period': {
            base: {
              overflow: 'hidden',
              height: 34,
              alignItems: 'center',
              width: '100%',
            }
          }
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
