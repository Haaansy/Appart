import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Timestamp } from 'firebase/firestore';
import DateCard from './DateCard';

interface BookingDateDisplayProps {
  dates: Timestamp[];
  title: string;
}

const BookingDateDisplay: React.FC<BookingDateDisplayProps> = ({ dates, title }) => {
  if (!dates || dates.length === 0) return null;
  
  return (
    <>
      <Text style={styles.subtitle}>{title}</Text>
      <View style={styles.container}>
        <DateCard date={dates[0]} />
        
        {dates.length > 1 && (
          <>
            <Ionicons
              name="chevron-forward"
              size={24}
              color="black"
              style={styles.icon}
            />
            <DateCard date={dates[dates.length - 1]} />
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: "row", 
    alignItems: "center"
  },
  subtitle: { 
    fontSize: 13, 
    fontWeight: "600", 
    marginLeft: 10 
  },
  icon: { 
    marginHorizontal: 20 
  }
});

export default BookingDateDisplay;
