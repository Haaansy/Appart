import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useCallback, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import UserData from "@/app/types/UserData";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { useCurrentUserMetrics } from "@/app/hooks/users/getCurrentUserMetrics";
import AnalyticsGraph from "@/app/components/Analytics/AnalyticsGraph";
import OccupancyChart from "@/app/components/Analytics/OccupancyChart";
import AnalyticsCard from "@/app/components/Analytics/AnalyticsCard";

interface AnalyticsProps {
  currentUserData: UserData;
}

const formatNumber = (num: number) => {
  if (typeof num !== "number") return num;
  return num.toLocaleString();
};

const Analytics: React.FC<AnalyticsProps> = ({ currentUserData }) => {
  const { metrics, loading, error } = useCurrentUserMetrics();

  // Use metrics if available, otherwise fallback to mockAnalytics
  const analytics = metrics
    ? {
        forecastedIncome: metrics.forecasted_income || 0,
        occupancyRate: metrics.occupancy_rate || 0,
        totalBookings: metrics.bookings || 0,
        avgApartmentPrice: metrics.apartments || 0,
        avgTransientPrice: metrics.transients || 0,
        propertiesPosted: metrics.properties || 0,
        guestsThisMonth: metrics.guest || 0,
        createdAt: metrics.createdAt,
      }
    : {
        forecastedIncome: 0,
        occupancyRate: 0,
        totalBookings: 0,
        avgApartmentPrice: 0,
        avgTransientPrice: 0,
        propertiesPosted: 0,
        guestsThisMonth: 0,
        createdAt: 0,
      };

  const peso = "₱";
  const now = new Date();
  const monthName = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();

  if (loading) {
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
              {monthName} {year}
            </Text>
            <TouchableOpacity onPress={() => {}}>
              <Ionicons
                name="chevron-down"
                size={24}
                color={Colors.primaryBackground}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.subtext}>
            {`Updated on ${
              typeof analytics.createdAt === "object" &&
              analytics.createdAt?.seconds
                ? new Date(
                    analytics.createdAt.seconds * 1000
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
            {peso} {formatNumber(analytics.forecastedIncome)}
          </Text>
        </View>
        <ScrollView
          style={{ flex: 1, marginTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 12 }}>
            <AnalyticsGraph />
            <OccupancyChart occupancyRate={metrics?.occupancy_rate as number} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, padding: 8}}
            >
              <AnalyticsCard
                title={"Tenants"}
                subtitle={"total number of tenant this month for apartments."}
                value={metrics?.tenants as number}
              />
              <AnalyticsCard
                title={"Guests"}
                subtitle={"total number of guest this month for transients."}
                value={metrics?.guest as number}
              />
              <AnalyticsCard
                title={"Bookings"}
                subtitle={"total number of successful bookings this month."}
                value={metrics?.bookings as number}
              />
            </ScrollView>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8, padding: 8}}
            >
              <AnalyticsCard
                title={"Properties"}
                subtitle={"total number of properties posted in this platform."}
                value={metrics?.properties as number}
              />
              <AnalyticsCard
                title={"Apartments"}
                subtitle={"total number of apartment posted in this platform."}
                value={metrics?.apartments as number}
              />
              <AnalyticsCard
                title={"Transients"}
                subtitle={"total number of transient posted in this platform."}
                value={metrics?.transients as number}
              />
            </ScrollView>
          </View>
        </ScrollView>
      </View>
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
