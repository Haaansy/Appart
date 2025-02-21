import React, { useState } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet, LayoutChangeEvent } from "react-native";
import Colors from "@/assets/styles/colors";

interface CustomSwitchProps {
  initialValue: boolean;
  onValueChange: (newValue: boolean) => void;
  leftLabel: string;
  rightLabel: string;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ initialValue, onValueChange, leftLabel, rightLabel }) => {
  const [switchWidth, setSwitchWidth] = useState(200);
  const [thumbWidth, setThumbWidth] = useState(0);
  const [isOn, setIsOn] = useState(initialValue);
  const animatedValue = useState(new Animated.Value(initialValue ? 1 : 0))[0];

  const toggleSwitch = () => {
    const newValue = !isOn;
    setIsOn(newValue);

    Animated.timing(animatedValue, {
      toValue: newValue ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      onValueChange(newValue);
    });
  };

  const handleLayout = (event: LayoutChangeEvent) => {
    const width = event.nativeEvent.layout.width;
    setSwitchWidth(width);
    setThumbWidth(width * 0.45);
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.switchContainer} onPress={toggleSwitch} onLayout={handleLayout}>
      {/* Background Labels */}
      <View style={styles.switchBackground}>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, !isOn ? styles.activeText : styles.inactiveText]}>{leftLabel}</Text>
        </View>
        <View style={styles.labelContainer}>
          <Text style={[styles.label, isOn ? styles.activeText : styles.inactiveText]}>{rightLabel}</Text>
        </View>
      </View>

      {/* Animated Thumb with Active Label Inside */}
      <Animated.View
        style={[
          styles.switchThumb,
          {
            width: thumbWidth,
            transform: [
              {
                translateX: animatedValue.interpolate({
                  inputRange: [0, 1],
                  outputRange: [4, switchWidth - thumbWidth - 4],
                }),
              },
            ],
          },
        ]}
      >
        <Text style={styles.thumbText}>{isOn ? rightLabel : leftLabel}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    width: "100%",
    height: 55,
    borderRadius: 30,
    backgroundColor: Colors.alternate,
    justifyContent: "center",
    padding: 4,
    position: "relative",
    overflow: "hidden",
  },
  switchBackground: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  labelContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
  },
  activeText: {
    color: Colors.primaryBackground,
  },
  inactiveText: {
    color: Colors.secondaryText,
  },
  switchThumb: {
    height: 47,
    borderRadius: 25,
    backgroundColor: Colors.primary,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryBackground,
    textAlign: "center",
  },
});

export default CustomSwitch;