import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/assets/styles/colors";
import { LineChart } from "react-native-gifted-charts";
import { Timestamp } from "firebase/firestore";

export interface Metric {
  apartments: number;
  bookings: number;
  createdAt: Timestamp;
  forecasted_income: number;
  guest: number;
  id: string;
  occupancy_rate: number;
  properties: number;
  tenants: number;
  transients: number;
  userId: string;
}

interface AnalyticsGraphProps {
  metrics: Metric[];
  rangeStart?: Date | null;
  rangeEnd?: Date | null;
}

const customDataPoint = () => {
  return (
    <View
      style={{
        width: 5,
        height: 5,
        backgroundColor: Colors.primaryBackground,
        borderWidth: 2,
        borderRadius: 10,
        borderColor: Colors.primary,
      }}
    />
  );
};

const AnalyticsGraph: React.FC<AnalyticsGraphProps> = ({ metrics, rangeStart, rangeEnd }) => {
  // Convert metrics to array if it's not already an array
  const metricsArray = Array.isArray(metrics) ? metrics : [metrics];

  if (!metricsArray || metricsArray.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }

  // Prepare data for the chart and sort chronologically
  const chartData = metricsArray
    .map((metric) => {
      const date = metric.createdAt?.toDate
        ? metric.createdAt.toDate()
        : new Date(metric.createdAt.seconds * 1000);
      
      return {
        value: metric.forecasted_income || 0,
        label: `${date.getMonth() + 1}/${date.getDate()}`,
        date: date, // Store the full date for sorting
      };
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime()) // Sort by date in ascending order
    .map(({ value, label }) => ({ value, label })); // Remove the date property used for sorting

  // Ensure chartData is not empty
  if (chartData.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No data available for the chart</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topMenu}>
        <TouchableOpacity>
          <Text style={styles.menuText}>Monthly</Text>
        </TouchableOpacity>
      </View>
      {(rangeStart || rangeEnd) ? (
        <Text style={{ textAlign: "center", color: Colors.primary, marginBottom: 8 }}>
          {rangeStart && rangeEnd
            ? `Showing: ${rangeStart.toLocaleDateString()} - ${rangeEnd.toLocaleDateString()}`
            : rangeStart
            ? `Showing: ${rangeStart.toLocaleDateString()}`
            : null}
        </Text>
      ) : null}
      <LineChart
        data={chartData}
        color={Colors.primary}
        thickness={4}
        dataPointsColor={Colors.primary}
        hideYAxisText
        isAnimated
        hideAxesAndRules
        customDataPoint={customDataPoint}
        showValuesAsDataPointsText
      />
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
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  menuText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "bold",
  },
});

export default AnalyticsGraph;
