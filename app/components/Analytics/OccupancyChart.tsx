import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/assets/styles/colors";
import { PieChart } from "react-native-gifted-charts";
import { Ionicons } from "@expo/vector-icons";

interface OccupancyChartProps {
  occupancyRate: number;
}

const OccupancyChart: React.FC<OccupancyChartProps> = ({ occupancyRate }) => {
  return (
    <View style={styles.container}>
      <View style={styles.topMenu}>
        <Text style={styles.menuText}>Occupancy Rate</Text>
        <Text style={styles.menuSubtext}>
          Occupancy rate is the percentage of time your properties are booked
          compared to the total available time.
        </Text>
        <Text
          style={styles.percentageValue}
        >{`${Math.round(occupancyRate * 100) / 100}%`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },
  topMenu: {
    flexDirection: "column",
    marginBottom: 40,
  },
  menuText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "bold",
  },
  menuSubtext: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 4,
    textAlign: "left",
    opacity: 0.85,
    marginBottom: 20,
  },
  percentageValue: {
    fontSize: 35,
    fontWeight: "bold",
    color: Colors.primary,
    textAlign: "center",
    marginTop: 10,
  },
});

export default OccupancyChart;
