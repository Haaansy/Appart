import Colors from "@/assets/styles/colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
      marginTop: 60,
    },
    form: {
      marginTop: 15,
      backgroundColor: Colors.primaryBackground,
      borderRadius: 20,
      padding: 15,
      paddingVertical: 25,
      width: "100%",
    },
    text: {
      fontSize: 40,
      fontWeight: "bold",
      marginTop: 25,
      color: Colors.primaryBackground,
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignContent: "center",
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: "gray",
      marginHorizontal: 5,
    },
    activeDot: {
      backgroundColor: Colors.primary,
    },
    subtext: {
      fontSize: 18,
      fontWeight: "bold",
      textAlign: "center",
    },
    disabledButton: {
      backgroundColor: "gray",
    },
  });