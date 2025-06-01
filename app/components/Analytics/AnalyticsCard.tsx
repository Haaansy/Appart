import { View, Text, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";

interface AnalyticsCardProps {
  title: string;
  subtitle: string;
  value: number;
  increasePercentage?: number;
}

const AnalyticsCard:React.FC<AnalyticsCardProps> = ({
  title,
  subtitle,
  value,
  increasePercentage = 0,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardSubtitle}>
        {subtitle}
      </Text>
      <Text style={styles.cardValue}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 200,
    height: 160,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // for Android
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primary,
  },
  cardSubtitle: {
    fontSize: 10,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  cardValue: {
    fontSize: 42,
    fontWeight: "bold",
    color: Colors.primary,
    marginTop: 10,
    alignSelf: "center",
  },
});

export default AnalyticsCard;
