import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  ScrollView, // <-- add this import
  RefreshControl,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import UserData from "@/app/types/UserData";
import Colors from "@/assets/styles/colors";
import { MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import { useCurrentUserMetrics } from "@/app/hooks/users/getCurrentUserMetrics";

interface AnalyticsProps {
  currentUserData: UserData;
}

const formatNumber = (num: number) => {
  if (typeof num !== "number") return num;
  return num.toLocaleString();
};

const Analytics: React.FC<AnalyticsProps> = ({ currentUserData }) => {
  const { metrics, loading, error, refresh } = useCurrentUserMetrics();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refresh();
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Use metrics if available, otherwise fallback to mockAnalytics
  const analytics = metrics
    ? {
        forecastedIncome: metrics.forecasted_income,
        occupancyRate: metrics.occupancy_rate,
        totalBookings: metrics.bookings,
        avgApartmentPrice: metrics.avg_apartment_price,
        avgTransientPrice: metrics.avg_transient_price,
        propertiesPosted: metrics.property_posted,
        guestsThisMonth: metrics.total_guest,
      }
    : {
        forecastedIncome: 0,
        occupancyRate: 0,
        totalBookings: 0,
        avgApartmentPrice: 0,
        avgTransientPrice: 0,
        propertiesPosted: 0,
        guestsThisMonth: 0,
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
        <ScrollView
          style={{ flex: 1, marginTop: 20 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Month at the top */}
          <View style={styles.monthHeader}>
            <Text style={styles.monthHeaderText}>
              {monthName} {year}
            </Text>
          </View>
          {/* Analytics Cards */}
          <View style={styles.analyticsGrid}>
            <View style={styles.analyticsCard}>
              <MaterialCommunityIcons
                name="cash-multiple"
                size={28}
                color={Colors.primary}
                style={styles.analyticsIcon}
              />
              <Text style={styles.analyticsLabel}>Forecasted Income</Text>
              <Text style={styles.analyticsValue}>
                {peso}
                {formatNumber(analytics.forecastedIncome)}
              </Text>
              <Text style={styles.analyticsDetail}>
                Expected income for the upcoming month based on current
                bookings.
              </Text>
            </View>
            <View style={styles.analyticsCard}>
              <FontAwesome5
                name="bed"
                size={24}
                color={Colors.primary}
                style={styles.analyticsIcon}
              />
              <Text style={styles.analyticsLabel}>Occupancy Rate</Text>
              <Text style={styles.analyticsValue}>
                {formatNumber(analytics.occupancyRate)}%
              </Text>
              <Text style={styles.analyticsDetail}>
                Percentage of booked properties out of all available properties.
              </Text>
            </View>
            <View style={styles.analyticsCard}>
              <MaterialCommunityIcons
                name="calendar-check"
                size={28}
                color={Colors.primary}
                style={styles.analyticsIcon}
              />
              <Text style={styles.analyticsLabel}>Bookings</Text>
              <Text style={styles.analyticsValue}>
                {formatNumber(analytics.totalBookings)}
              </Text>
              <Text style={styles.analyticsDetail}>
                Total confirmed bookings.
              </Text>
            </View>
            <View style={styles.analyticsCard}>
              <MaterialCommunityIcons
                name="account-group"
                size={28}
                color={Colors.primary}
                style={styles.analyticsIcon}
              />
              <Text style={styles.analyticsLabel}>Guests</Text>
              <Text style={styles.analyticsValue}>
                {formatNumber(analytics.guestsThisMonth)}
              </Text>
              <Text style={styles.analyticsDetail}>
                Number of guests who booked your properties.
              </Text>
            </View>
            <View style={styles.analyticsCard}>
              <MaterialCommunityIcons
                name="home-city"
                size={28}
                color={Colors.primary}
                style={styles.analyticsIcon}
              />
              <Text style={styles.analyticsLabel}>Properties Posted</Text>
              <Text style={styles.analyticsValue}>
                {formatNumber(analytics.propertiesPosted)}
              </Text>
              <Text style={styles.analyticsDetail}>
                Total properties you have listed on the platform.
              </Text>
            </View>
            {/* More details */}
            <View style={styles.analyticsCard}>
              <MaterialCommunityIcons
                name="star"
                size={28}
                color={Colors.primary}
                style={styles.analyticsIcon}
              />
              <Text style={styles.analyticsLabel}>Average Apartment Price</Text>
              <Text style={styles.analyticsValue}>
                {peso}
                {formatNumber(analytics.avgApartmentPrice)}
              </Text>
              <Text style={styles.analyticsDetail}>
                Average price per month for apartment-type listings.
              </Text>
            </View>
            <View style={styles.analyticsCard}>
              <MaterialCommunityIcons
                name="star-outline"
                size={28}
                color={Colors.primary}
                style={styles.analyticsIcon}
              />
              <Text style={styles.analyticsLabel}>Average Transient Price</Text>
              <Text style={styles.analyticsValue}>
                {peso}
                {formatNumber(analytics.avgTransientPrice)}
              </Text>
              <Text style={styles.analyticsDetail}>
                Average price per night for transient-type listings.
              </Text>
            </View>
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
  form: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  deleteButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },
  deleteButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  deleteIcon: {
    width: 40,
    height: 40,
    color: Colors.error,
  },
  character: {
    width: "50%",
    height: "50%",
    resizeMode: "cover",
    marginBottom: 10,
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
  monthHeader: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  monthHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primaryBackground,
    letterSpacing: 1,
  },
});

export default Analytics;
