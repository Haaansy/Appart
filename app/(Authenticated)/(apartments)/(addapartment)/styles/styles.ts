import Colors from "@/assets/styles/colors";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    wrapper: {},
    backgroundVector: {
        height: "90%",
        width: "100%",
        resizeMode: "stretch",
        position: "absolute",
        top: -350,
        backgroundColor: Colors.secondaryBackground,
    },
    titleContainer: {
        marginTop: 30,
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: 60,
        height: 60,
        resizeMode: "cover",
    },
    text: {
        fontSize: 35,
        fontWeight: "bold",
        color: Colors.primaryBackground,
        marginLeft: 15,
    },
    form: {
        marginTop: 15,
        backgroundColor: Colors.primaryBackground,
        borderRadius: 20,
        padding: 15,
        paddingVertical: 25,
        width: "100%",
    },
    rememberMeButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    line: {
        height: 1,
        backgroundColor: Colors.alternate, // Light gray color
        marginVertical: 10,
        width: "40%",
    },
    dotsContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        marginTop: 15,
        width: "100%",
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.secondaryText,
        marginHorizontal: 5,
    },
    activeDot: {
        backgroundColor: Colors.primary,
        width: "15%",
    },
    subtext: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    disabledButton: {
        backgroundColor: "gray",
    },
    stepIndicatorContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginVertical: 15,
    },

    stepIndicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: Colors.border, // Default color
    },
});