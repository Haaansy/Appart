import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/assets/styles/colors";
import { Timestamp } from "firebase/firestore";

interface DateCardProps {
  date: Timestamp;
}

const DateCard: React.FC<DateCardProps> = ({ date }) => {
  // Convert Firestore Timestamp to JavaScript Date
  const jsDate = date.toDate();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const month = monthNames[jsDate.getMonth()];
  const day = jsDate.getDate();
  const year = jsDate.getFullYear();

  return (
    <View style={styles.container}>
      <Text style={styles.monthText}>{month}</Text>
      <Text style={styles.dayText}>{day}</Text>
      <Text style={styles.yearText}>{year}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  monthText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
    top: 10,
    left: 10,
  },
  dayText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  yearText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
    bottom: 10,
    right: 10,
  },
});

export default DateCard;
