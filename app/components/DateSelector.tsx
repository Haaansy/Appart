import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomDropdown from "@/app/components/CustomDropDown";

const months = [
  { label: "January", value: "01" },
  { label: "February", value: "02" },
  { label: "March", value: "03" },
  { label: "April", value: "04" },
  { label: "May", value: "05" },
  { label: "June", value: "06" },
  { label: "July", value: "07" },
  { label: "August", value: "08" },
  { label: "September", value: "09" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const years = Array.from({ length: 100 }, (_, i) => `${new Date().getFullYear() - i}`);

interface DateSelectorProps {
  value: { month: string; day: string; year: string };
  onChange: (date: { month: string; day: string; year: string }) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ value, onChange }) => {
  const [days, setDays] = useState<string[]>([]);

  // Function to get the correct number of days for the selected month & year
  const updateDays = (selectedMonth: string, selectedYear: string) => {
    let daysInMonth = 31;
    if (selectedMonth === "04" || selectedMonth === "06" || selectedMonth === "09" || selectedMonth === "11") {
      daysInMonth = 30; // April, June, September, November have 30 days
    } else if (selectedMonth === "02") {
      const isLeapYear = Number(selectedYear) % 4 === 0 && (Number(selectedYear) % 100 !== 0 || Number(selectedYear) % 400 === 0);
      daysInMonth = isLeapYear ? 29 : 28; // February: 28 or 29 in a leap year
    }
    setDays(Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`));
  };

  // Update days when month or year changes
  useEffect(() => {
    updateDays(value.month, value.year);
  }, [value.month, value.year]);

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.row}>
        {/* Month Dropdown */}
        <View style={[styles.dropdownContainer, { flex: 1.5 }]}>
          <CustomDropdown
            label="Month"
            options={months.map((m) => m.label)}
            onSelect={(monthLabel) => {
              const selectedMonth = months.find((m) => m.label === monthLabel)?.value || "01";
              onChange({ ...value, month: selectedMonth, day: "01" });
            }}
            selectedValue={months.find((m) => m.value === value.month)?.label || ""}
          />
        </View>

        {/* Day Dropdown */}
        <View style={[styles.dropdownContainer, { flex: 0.8 }]}>
          <CustomDropdown
            label="Day"
            options={days}
            onSelect={(day) => onChange({ ...value, day })}
            selectedValue={value.day}
          />
        </View>

        {/* Year Dropdown */}
        <View style={[styles.dropdownContainer, { flex: 1 }]}>
          <CustomDropdown
            label="Year"
            options={years}
            onSelect={(year) => onChange({ ...value, year, day: "01" })}
            selectedValue={value.year}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  dropdownContainer: {
    marginHorizontal: 5,
  },
});

export default DateSelector;
