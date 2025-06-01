import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Colors from "@/assets/styles/colors";
import { LineChart } from "react-native-gifted-charts";
import { useCurrentUserMonthlyMetrics } from "@/app/hooks/users/getCurrentUserMonthlyMetrics";

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

const AnalyticsGraph = () => {
  const { monthlyMetrics, loading, error } = useCurrentUserMonthlyMetrics();

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  if (!monthlyMetrics || monthlyMetrics.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No data available</Text>
      </View>
    );
  }

  // Prepare data for the chart
  const chartData = monthlyMetrics.map((metric) => ({
    value: metric.forecasted_income || 0,
    label: metric.createdAt?.toDate 
      ? `${metric.createdAt.toDate().getMonth() + 1}/${metric.createdAt.toDate().getDate()}`
      : `${new Date(metric.createdAt).getMonth() + 1}/${new Date(metric.createdAt).getDate()}`,
  }));

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
