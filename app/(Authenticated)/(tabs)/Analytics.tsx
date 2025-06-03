import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
} from "react-native";
import React, { useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import UserData from "@/app/types/UserData";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentUserMetrics } from "@/app/hooks/users/getCurrentUserMetrics";
import useCurrentAvailableMetrics from "@/app/hooks/users/getCurrentAvailableMetrics";
import AnalyticsGraph from "@/app/components/Analytics/AnalyticsGraph";
import OccupancyChart from "@/app/components/Analytics/OccupancyChart";
import AnalyticsCard from "@/app/components/Analytics/AnalyticsCard";
import { Timestamp } from "firebase/firestore";

interface AnalyticsProps {
  currentUserData: UserData;
}

const formatNumber = (num: number) => {
  if (typeof num !== "number") return num;
  return num.toLocaleString();
};

const MONTHS = [
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

const getCurrentMonthYear = () => {
  const now = new Date();
  return { month: now.getMonth(), year: now.getFullYear() };
};

const Analytics: React.FC<AnalyticsProps> = ({ currentUserData }) => {
  const [{ month: selectedMonth, year: selectedYear }, setSelectedMonthYear] =
    useState(getCurrentMonthYear());
  
  const { metrics, latestMetric,loading, error, fetchMetricsForMonthYear } = useCurrentUserMetrics(
    MONTHS[selectedMonth].toString(), 
    selectedYear.toString()
  );
  
  const { monthYearArr, loading: idsLoading } = useCurrentAvailableMetrics();

  const peso = "₱";

  // Modal state for year/month selection
  const [yearModalVisible, setYearModalVisible] = useState(false);
  const [monthModalVisible, setMonthModalVisible] = useState(false);

  // Extract available years and months from monthYearArr
  const availableYears = Array.from(
    new Set(monthYearArr.map((item) => parseInt(item.year)))
  ).sort((a, b) => b - a); // Sort years in descending order
  
  // Get available months for the selected year
  const availableMonths = monthYearArr
    .filter((item) => parseInt(item.year) === selectedYear)
    .map((item) => {
      // Handle month correctly whether it's a string name or a numeric index
      const monthIdx = isNaN(parseInt(item.month)) 
        ? MONTHS.indexOf(item.month) // Convert month name to index
        : parseInt(item.month);      // Use month index directly
    
      return {
        name: MONTHS[monthIdx] || item.month, // Fallback to the original string if not found
        idx: monthIdx
      };
    })
    .sort((a, b) => a.idx - b.idx); // Sort months in ascending order
  
  // Handle month/year selection
  const handleYearSelection = (year: number) => {
    setSelectedMonthYear((prev) => ({ ...prev, year }));
    setYearModalVisible(false);
    
    // Only show month modal if there are available months for this year
    const monthsForYear = monthYearArr.filter(item => parseInt(item.year) === year);
    if (monthsForYear.length > 0) {
      setTimeout(() => setMonthModalVisible(true), 200);
    }
  };
  
  const handleMonthSelection = (monthIdx: number) => {
    setSelectedMonthYear((prev) => ({ ...prev, month: monthIdx }));
    setMonthModalVisible(false);
    
    // Find the original month value from monthYearArr for consistency
    const monthEntry = monthYearArr.find(
      item => parseInt(item.year) === selectedYear && 
      (MONTHS.indexOf(item.month) === monthIdx || parseInt(item.month) === monthIdx)
    );
    
    // Use the original month format when fetching metrics
    const monthValue = monthEntry ? monthEntry.month : monthIdx.toString();
    fetchMetricsForMonthYear(monthValue, selectedYear.toString());
  };
  
  // If no data is available, show a message
  if (!loading && !error && monthYearArr.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <Text>No analytics data available</Text>
      </View>
    );
  }

  if (loading || idsLoading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading analytics...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ImageBackground
        source={require("@/assets/images/Vectors/background.png")}
        style={styles.backgroundVector}
      />
      <View style={[styles.container]}>
        <View style={styles.topBar}>
          <Image
            source={require("@/assets/images/Icons/Dark-Icon.png")}
            style={styles.icon}
          />
          <View style={{ flexDirection: "column", marginLeft: 15 }}>
            <Text style={styles.greetings}>
              Hey, {currentUserData?.displayName || "Guest"}!
            </Text>
            <Text style={styles.subtext}>Here are your daily reports.</Text>
          </View>
        </View>

        {/* Month at the top */}
        <View style={styles.monthContainer}>
          <View style={styles.monthHeader}>
            <Text style={styles.monthHeaderText}>
              {MONTHS[selectedMonth]} {selectedYear}
            </Text>
            <TouchableOpacity 
              onPress={() => {
                if (availableYears.length > 0) {
                  setYearModalVisible(true);
                }
              }}
              disabled={availableYears.length === 0}
            >
              <Ionicons
                name="chevron-down"
                size={24}
                color={availableYears.length > 0 ? Colors.primaryBackground : Colors.secondaryText}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtext}>
            {`Updated as of ${
              latestMetric.createdAt?.seconds
                ? new Date(
                    latestMetric.createdAt.seconds * 1000
                  ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })
                : "No date available"
            }`}
          </Text>
        </View>
        <View style={{ marginTop: 5 }}>
          <Text
            style={{
              color: Colors.primaryBackground,
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 5,
            }}
          >
            Forecasted Income
          </Text>
          <Text
            style={{
              alignSelf: "center",
              fontSize: 36,
              fontWeight: "bold",
              color: Colors.primaryBackground,
            }}
          >
            {peso} {formatNumber(latestMetric.forecasted_income)}
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1, marginTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 12 }}>
            <AnalyticsGraph metrics={metrics} />
            <OccupancyChart occupancyRate={latestMetric?.occupancy_rate as number} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, padding: 8 }}
            >
              <AnalyticsCard
                title={"Tenants"}
                subtitle={"total number of tenant this month for apartments."}
                value={latestMetric?.tenants as number}
              />
              <AnalyticsCard
                title={"Guests"}
                subtitle={"total number of guest this month for transients."}
                value={latestMetric?.guest as number}
              />
              <AnalyticsCard
                title={"Bookings"}
                subtitle={"total number of successful bookings this month."}
                value={latestMetric?.bookings as number}
              />
            </ScrollView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, padding: 8 }}
            >
              <AnalyticsCard
                title={"Properties"}
                subtitle={"total number of properties posted in this platform."}
                value={latestMetric?.properties as number}
              />
              <AnalyticsCard
                title={"Apartments"}
                subtitle={"total number of apartment posted in this platform."}
                value={latestMetric?.apartments as number}
              />
              <AnalyticsCard
                title={"Transients"}
                subtitle={"total number of transient posted in this platform."}
                value={latestMetric?.transients as number}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </View>
      {/* Year Picker Modal */}
      <Modal
        visible={yearModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setYearModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setYearModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              minWidth: 220,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              Select Year
            </Text>
            <ScrollView
              style={{ maxHeight: 200 }}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {availableYears.length > 0 ? (
                availableYears.map((y) => (
                  <Pressable
                    key={`year-${y}`} // Changed to ensure uniqueness
                    style={{
                      padding: 10,
                      backgroundColor:
                        y === selectedYear ? Colors.primary : "transparent",
                      borderRadius: 8,
                      marginBottom: 4,
                    }}
                    onPress={() => handleYearSelection(y)}
                  >
                    <Text
                      style={{
                        color: y === selectedYear ? "#fff" : Colors.secondaryText,
                        fontWeight: y === selectedYear ? "bold" : "normal",
                        fontSize: 16,
                      }}
                    >
                      {y}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text style={{ color: Colors.secondaryText, padding: 10 }}>
                  No data available
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 10,
                alignItems: "center",
              }}
              onPress={() => setYearModalVisible(false)}
            >
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
      {/* Month Picker Modal */}
      <Modal
        visible={monthModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMonthModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.3)",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setMonthModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 24,
              minWidth: 220,
              elevation: 10,
            }}
          >
            <Text
              style={{
                fontWeight: "bold",
                fontSize: 18,
                marginBottom: 12,
              }}
            >
              Select Month for {selectedYear}
            </Text>
            <ScrollView
              style={{ maxHeight: 300 }}
              nestedScrollEnabled
              showsVerticalScrollIndicator={false}
            >
              {availableMonths.length > 0 ? (
                availableMonths.map(({ name, idx }) => (
                  <Pressable
                    key={`month-${selectedYear}-${idx}`} // Changed to ensure uniqueness
                    style={{
                      padding: 10,
                      backgroundColor:
                        idx === selectedMonth ? Colors.primary : "transparent",
                      borderRadius: 8,
                      marginBottom: 4,
                    }}
                    onPress={() => handleMonthSelection(idx)}
                  >
                    <Text
                      style={{
                        color: idx === selectedMonth ? "#fff" : Colors.secondaryText,
                        fontWeight: idx === selectedMonth ? "bold" : "normal",
                        fontSize: 16,
                      }}
                    >
                      {name}
                    </Text>
                  </Pressable>
                ))
              ) : (
                <Text style={{ color: Colors.secondaryText, padding: 10 }}>
                  No months available for {selectedYear}
                </Text>
              )}
            </ScrollView>
            <TouchableOpacity
              style={{
                marginTop: 10,
                alignItems: "center",
              }}
              onPress={() => setMonthModalVisible(false)}
            >
              <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    marginBottom: 110,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVector: {
    height: "90%",
    width: "100%",
    resizeMode: "stretch",
    position: "absolute",
    top: -350,
    backgroundColor: Colors.secondaryBackground,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  greetings: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryBackground,
  },
  subtext: {
    fontSize: 15,
    fontWeight: "regular",
    color: Colors.primaryBackground,
  },
  topBar: {
    flexDirection: "row",
    marginTop: 65,
    alignItems: "center",
  },
  analyticsGrid: {
    // Use column layout, each card 100% width, with spacing
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  analyticsCard: {
    backgroundColor: Colors.primaryBackground,
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 18,
    alignItems: "flex-start",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    width: "100%",
    marginBottom: 14,
  },
  analyticsIcon: {
    marginBottom: 8,
  },
  analyticsLabel: {
    fontSize: 13,
    color: Colors.secondaryText,
    marginTop: 4,
    marginBottom: 2,
    textAlign: "left",
  },
  analyticsValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 2,
    textAlign: "left",
    letterSpacing: 0.5,
  },
  analyticsDetail: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 4,
    textAlign: "left",
    opacity: 0.85,
  },
  chartContainer: {
    marginTop: 30,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 14,
    padding: 18,
    elevation: 4,
    alignItems: "center",
  },
  chartTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 10,
  },
  lineChart: {
    width: 240,
    height: 120,
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  lineChartLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 240,
    marginTop: 4,
  },
  barLabel: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
    width: 34,
    textAlign: "center",
  },
  incomeDetails: {
    marginTop: 18,
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 10,
  },
  incomeDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    paddingHorizontal: 6,
  },
  incomeDetailMonth: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  incomeDetailValue: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "bold",
  },
  badge: {
    marginLeft: 6,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 32,
    minHeight: 20,
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "bold",
    textAlign: "center",
  },
  percentChange: {
    fontSize: 12,
    marginLeft: 4,
    color: "#888",
  },
  monthContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  monthHeader: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  monthHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primaryBackground,
    letterSpacing: 1,
  },
});

export default Analytics;
