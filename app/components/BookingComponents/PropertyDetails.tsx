import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { formatCurrency } from '@/app/utils/dateUtils';
import Colors from '@/assets/styles/colors';

interface PropertyDetailsProps {
  price: number;
  securityDeposit?: number;
  leaseDuration?: number;
  isApartment: boolean;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ 
  price, 
  securityDeposit = 0, 
  leaseDuration = 0,
  isApartment
}) => {
  return (
    <>
      <Text style={styles.subtitle}>Price</Text>
      <View style={styles.priceRow}>
        <Text style={styles.description}>
          {isApartment ? "Apartment Lease Price" : "Transient Rate"}
        </Text>
        <Text style={styles.description}>
          {formatCurrency(price)}
          {isApartment && leaseDuration > 1 ? "/mo" : ""}
        </Text>
      </View>
      
      {securityDeposit > 0 && (
        <View style={styles.priceRow}>
          <Text style={styles.description}>Security Deposit</Text>
          <Text style={styles.description}>{formatCurrency(securityDeposit)}</Text>
        </View>
      )}
      
      {isApartment && (
        <View style={styles.priceRow}>
          <Text style={styles.description}>Grand Total</Text>
          <Text style={styles.description}>
            {formatCurrency(securityDeposit + price)}
          </Text>
        </View>
      )}
      
      {!isApartment && leaseDuration > 0 && (
        <>
          <View style={styles.priceRow}>
            <Text style={styles.description}>Stay Duration</Text>
            <Text style={styles.description}>
              {`${leaseDuration} ${leaseDuration > 1 ? "days" : "day"}`}
            </Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.description}>Grand Total</Text>
            <Text style={styles.description}>
              {formatCurrency(price * leaseDuration)}
            </Text>
          </View>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  subtitle: { 
    fontSize: 13, 
    fontWeight: "600", 
    marginLeft: 10 
  },
  description: { 
    fontSize: 12, 
    marginLeft: 20 
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
  },
});

export default PropertyDetails;
