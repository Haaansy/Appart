import React, { useState, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import Colors from "@/assets/styles/colors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface CustomDropdownProps {
  label: string;
  options: string[];
  onSelect?: (value: string) => void;
  selectedValue?: string;
  // Multi-select support
  multiSelect?: boolean;
  selected?: string[];
  onMultiSelect?: (values: string[]) => void;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
  label,
  options,
  onSelect,
  selectedValue,
  multiSelect = false,
  selected = [],
  onMultiSelect,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [multiSelected, setMultiSelected] = useState<string[]>(selected || []);
  const animatedLabel = useRef(
    new Animated.Value(
      selectedValue || (selected && selected.length > 0) ? 1 : 0
    )
  ).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedLabel, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    if (
      !selectedValue &&
      (!multiSelect ||
        (multiSelect && (!selected || selected.length === 0)))
    ) {
      setIsFocused(false);
      Animated.timing(animatedLabel, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelect = (value: string) => {
    if (multiSelect) {
      let updated: string[];
      if (multiSelected.includes(value)) {
        updated = multiSelected.filter((v) => v !== value);
      } else {
        updated = [...multiSelected, value];
      }
      setMultiSelected(updated);
      onMultiSelect && onMultiSelect(updated);
    } else {
      onSelect && onSelect(value);
      setIsDropdownOpen(false);
      handleFocus();
    }
  };

  // Keep multiSelected in sync with parent
  React.useEffect(() => {
    if (multiSelect && selected) {
      setMultiSelected(selected);
    }
  }, [selected, multiSelect]);

  return (
    <View style={styles.container}>
      <Animated.Text
        style={[
          styles.label,
          {
            top: animatedLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [17, -8],
            }),
            fontSize: animatedLabel.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 12],
            }),
            color: isFocused ? Colors.primary : Colors.secondaryText,
          },
        ]}
      >
        {label}
      </Animated.Text>

      <TouchableOpacity
        style={[styles.inputContainer, isFocused && styles.inputFocused]}
        onPress={() => setIsDropdownOpen(true)}
      >
        <Text
          style={[
            styles.input,
            (selectedValue || (multiSelect && multiSelected.length > 0))
              ? {}
              : styles.placeholder,
          ]}
        >
          {multiSelect
            ? multiSelected.length > 0
              ? multiSelected.join(", ")
              : label
            : selectedValue || label}
        </Text>
        <Icon
          name={isDropdownOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color={Colors.secondaryText}
        />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal visible={isDropdownOpen} transparent animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsDropdownOpen(false)}
        >
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    multiSelect &&
                      multiSelected.includes(item) && {
                        backgroundColor: Colors.primary + "22",
                      },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>
                    {item}
                    {multiSelect && multiSelected.includes(item) ? " ✓" : ""}
                  </Text>
                </TouchableOpacity>
              )}
            />
            {multiSelect && (
              <TouchableOpacity
                style={{
                  marginTop: 10,
                  alignSelf: "flex-end",
                  backgroundColor: Colors.primary,
                  borderRadius: 8,
                  paddingVertical: 8,
                  paddingHorizontal: 18,
                }}
                onPress={() => setIsDropdownOpen(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Done</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 12,
    position: "relative",
  },
  label: {
    position: "absolute",
    left: 15,
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: 5,
    zIndex: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 15,
    backgroundColor: Colors.primaryBackground,
    padding: 15,
    justifyContent: "space-between",
  },
  input: {
    fontSize: 16,
    color: Colors.primaryText,
  },
  placeholder: {
    color: Colors.secondaryText,
  },
  inputFocused: {
    borderColor: Colors.primary,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    width: "80%",
    backgroundColor: Colors.primaryBackground,
    borderRadius: 15,
    padding: 10,
    maxHeight: 200,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionText: {
    fontSize: 16,
    color: Colors.primaryText,
  },
});

export default CustomDropdown;
