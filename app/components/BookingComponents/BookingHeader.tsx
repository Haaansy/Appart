import { View, Text, StyleSheet, Image } from 'react-native';
import React from 'react';
import UserData from '@/app/types/UserData';

interface BookingHeaderProps {
  tenantUser: UserData;
  status: string;
  propertyType: "Apartment" | "Transient";
}

const BookingHeader: React.FC<BookingHeaderProps> = ({ 
  tenantUser, 
  status,
  propertyType 
}) => {
  return (
    <>
      <View style={styles.container}>
        <Image
          source={{ uri: tenantUser.photoUrl }}
          style={styles.avatar}
        />
        <View style={styles.textContainer}>
          <Text style={styles.username}>{`@${tenantUser.displayName}`}</Text>
          <Text style={styles.bookingText}>
            Wants to book {propertyType === "Apartment" ? "an apartment" : "a transient"}.
          </Text>
        </View>
      </View>
      
      {status === "Booked" ? (
        <Text style={styles.statusText}>
          Waiting for Owner's Approval
        </Text>
      ) : (
        <Text style={styles.statusText}>
          {status}
        </Text>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flexDirection: "row", 
    alignItems: "center" 
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  textContainer: { 
    marginLeft: 10 
  },
  username: { 
    fontWeight: "500",
    fontSize: 16
  },
  bookingText: { 
    fontWeight: "400", 
    fontSize: 12 
  },
  statusText: {
    fontSize: 16, 
    textAlign: "center", 
    marginTop: 15,
    fontWeight: "500"
  },
});

export default BookingHeader;
