import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/assets/styles/colors"; // Import your color theme

interface CounterProps {
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
  onChange?: (value: number) => void;
}

const Counter: React.FC<CounterProps> = ({
  initialValue = 0,
  min = 0, // Ensure no negative numbers
  max = Infinity,
  step = 1,
  onChange,
}) => {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    if (count < max) {
      const newValue = count + step;
      setCount(newValue);
      onChange?.(newValue);
    }
  };

  const decrement = () => {
    if (count > min) {
      const newValue = Math.max(count - step, min); // Ensure it never goes below min (0)
      setCount(newValue);
      onChange?.(newValue);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={decrement} disabled={count === min}>
        <Text style={[styles.minus, count === min && styles.disabled]}>−</Text>
      </TouchableOpacity>

      <Text style={styles.count}>{count}</Text>

      <TouchableOpacity onPress={increment} disabled={count === max}>
        <Text style={[styles.plus, count === max && styles.disabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  minus: {
    fontSize: 32,
    color: Colors.error,
    marginHorizontal: 15,
  },
  plus: {
    fontSize: 32,
    color: Colors.primary,
    marginHorizontal: 15,
  },
  count: {
    fontSize: 25,
    color: Colors.primaryText,
    minWidth: 40,
    textAlign: "center",
  },
  disabled: {
    color: Colors.alternate, // Ensure a disabled color exists in your theme
  },
});

export default Counter;
