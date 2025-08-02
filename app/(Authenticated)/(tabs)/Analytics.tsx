import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import UserData from "@/app/types/UserData";
import Colors from "@/assets/styles/colors";
import IconButton from "@/app/components/IconButton";
import { Calendar } from "react-native-calendars";
import CustomSwitch from "@/app/components/CustomSwitch";
import { useCurrentUserMetrics } from "@/app/hooks/users/getCurrentUserMetrics";
import AnalyticsGraph, {
  Metric,
} from "@/app/components/Analytics/AnalyticsGraph";
import { Ionicons } from "@expo/vector-icons";
import AnalyticsCard from "@/app/components/Analytics/AnalyticsCard";

interface AnalyticsProps {
  currentUserData: UserData;
}

const Analytics: React.FC<AnalyticsProps> = ({ currentUserData }) => {
  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [mode, setMode] = useState<"single" | "range">("single");
  const [range, setRange] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({ startDate: null, endDate: null });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const now = new Date();

  const { metrics, loading, error, latestMetric, fetch, fetchRange } =
    useCurrentUserMetrics();

  // Helper to mark selected range
  const getMarkedDates = () => {
    let marked: any = {};
    if (mode === "single" && selectedDate) {
      marked[selectedDate] = { selected: true, selectedColor: Colors.primary };
    } else if (mode === "range" && range.startDate) {
      const { startDate, endDate } = range;
      const start = new Date(startDate!);
      const end = endDate ? new Date(endDate) : start;
      let d = new Date(start);
      while (d <= end) {
        const dateString = d.toISOString().split("T")[0];
        marked[dateString] = {
          selected: true,
          color: Colors.primary,
          startingDay: dateString === startDate,
          endingDay: dateString === endDate,
        };
        d.setDate(d.getDate() + 1);
      }
    }
    return marked;
  };

  const handleDayPress = (day: any) => {
    if (mode === "single") {
      setSelectedDate(day.dateString);
      setRange({ startDate: null, endDate: null });
    } else {
      if (!range.startDate || (range.startDate && range.endDate)) {
        setRange({ startDate: day.dateString, endDate: null });
        setSelectedDate(null);
      } else if (range.startDate && !range.endDate) {
        if (day.dateString < range.startDate) {
          setRange({ startDate: day.dateString, endDate: range.startDate });
        } else {
          setRange({ startDate: range.startDate, endDate: day.dateString });
        }
        setSelectedDate(null);
      }
    }
  };

  // Fetch metrics for selected date or range
  const fetchMetric = async () => {
    if (mode === "single" && selectedDate) {
      const date = new Date(selectedDate);
      const month = date.toLocaleString("default", { month: "long" });
      const year = date.getFullYear();
      const day = date.getDate();
      fetch(month, year, day);
    } else if (mode === "range" && range.startDate && range.endDate) {
      fetchRange(new Date(range.startDate), new Date(range.endDate));
    } else {
      const now = new Date();
      const month = now.toLocaleString("default", { month: "long" });
      const year = now.getFullYear();

      setSelectedDate(now.toISOString().split("T")[0]);
      fetch(month, year);
    }
  };

  useEffect(() => {
    const now = new Date();
    const month = now.toLocaleString("default", { month: "long" });
    const year = now.getFullYear();

    fetch(month, year);
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  console.log("Metrics:", latestMetric);

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
        <View style={styles.monthHeader}>
          <Text style={styles.monthHeaderText}>
            {mode === "single"
              ? selectedDate
                ? new Date(selectedDate).toLocaleDateString(undefined, {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })
                : latestMetric?.createdAt
                  ? new Date(
                      latestMetric.createdAt.seconds * 1000
                    ).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : now.toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
              : range.startDate && range.endDate
                ? `${new Date(range.startDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })} - ${new Date(range.endDate).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}`
                : latestMetric?.createdAt
                  ? new Date(
                      latestMetric.createdAt.seconds * 1000
                    ).toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : now.toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
          </Text>
          <View style={styles.updatedContainer}>
            <Text style={styles.updatedText}>
              {" "}
              Updated as of {""}
              {new Date().toLocaleString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
        <IconButton
          onPress={() => {
            setCalendarModalVisible(true);
          }}
          icon="calendar"
          iconColor={Colors.primary}
          text="Select Date"
          textColor={Colors.primary}
          style={{
            width: "50%",
            alignSelf: "center",
            marginTop: 10,
            height: 50,
          }}
        />
        <View style={{ marginTop: 20 }}>
          <Text
            style={{
              fontSize: 16,
              color: Colors.primaryBackground,
              fontWeight: "bold",
            }}
          >
            Daily Forecasted Income
          </Text>
          <Text
            style={{
              fontSize: 40,
              color: Colors.primaryBackground,
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            {" "}
            ₱{" "}
            {(latestMetric?.forecasted_income &&
              latestMetric.forecasted_income.toLocaleString()) ||
              "0"}{" "}
          </Text>
        </View>
        <ScrollView style={{ flex: 1, marginTop: 10 }}>
          <AnalyticsGraph metrics={metrics as Metric[]} />
          <ScrollView
            style={{ marginTop: 20, paddingBottom: 20 }}
            contentContainerStyle={{ gap: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <AnalyticsCard
              title="Tenants"
              subtitle="total number of tenant for apartments"
              value={latestMetric?.tenants as number}
            />
            <AnalyticsCard
              title="Guests"
              subtitle="total number of guest for transients"
              value={latestMetric?.guest as number}
            />
            <AnalyticsCard
              title="Bookings"
              subtitle="total number of bookings"
              value={latestMetric?.bookings as number}
            />
          </ScrollView>
          <ScrollView
            style={{ marginTop: 20, paddingBottom: 20 }}
            contentContainerStyle={{ gap: 20 }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <AnalyticsCard
              title="Properties"
              subtitle="total number of properties posted in this platform."
              value={latestMetric?.properties as number}
            />
            <AnalyticsCard
              title="Apartments"
              subtitle="total number of apartments posted in this platform."
              value={latestMetric?.apartments as number}
            />
            <AnalyticsCard
              title="Transients"
              subtitle="total number of transient posted in this platform."
              value={latestMetric?.transients as number}
            />
          </ScrollView>
        </ScrollView>
      </View>

      {/* Calendar Modal */}
      {calendarModalVisible && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "80%",
              backgroundColor: Colors.primaryBackground,
              padding: 20,
              borderRadius: 10,
            }}
          >
            <Text style={{ color: Colors.primaryText, fontSize: 18 }}>
              Select Date
            </Text>
            <View style={{ marginVertical: 10 }}>
              <CustomSwitch
                initialValue={mode === "range"}
                onValueChange={(val: boolean) => {
                  setMode(val ? "range" : "single");
                  setRange({ startDate: null, endDate: null });
                  setSelectedDate(null);
                }}
                leftLabel="Single"
                rightLabel="Range"
              />
            </View>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={getMarkedDates()}
              markingType={mode === "range" ? "period" : "simple"}
              disableAllTouchEventsForDisabledDays={true}
            />
            <View style={{ flexDirection: "column", marginTop: 20, gap: 10 }}>
              <Button
                title="Done"
                onPress={() => {
                  fetchMetric(); // Fetch metrics based on selected date or range
                  setCalendarModalVisible(false);
                }}
              />
              <Button
                title="Clear Dates"
                onPress={() => {
                  // Clear all date selections
                  setSelectedDate(null);
                  setRange({ startDate: null, endDate: null });

                  // Fetch default metrics (current month)
                  const now = new Date();
                  const month = now.toLocaleString("default", {
                    month: "long",
                  });
                  const year = now.getFullYear();
                  fetch(month, year);

                  setCalendarModalVisible(false);
                }}
                color={Colors.error}
              />
            </View>
          </View>
        </View>
      )}
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
    flexDirection: "column",
    width: "100%",
    gap: 5,
  },
  monthHeaderText: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primaryBackground,
    letterSpacing: 1,
  },
  updatedText: {
    fontSize: 15,
    fontWeight: "regular",
    color: Colors.primaryBackground,
  },
  updatedContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Analytics;
