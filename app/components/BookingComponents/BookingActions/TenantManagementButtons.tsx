import { View, Text, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import Colors from '@/assets/styles/colors';
import IconButton from '@/app/components/IconButton';
import { useBookingActions } from '@/app/hooks/bookings/useBookingActions';
import Booking from '@/app/types/Booking';
import EvictionPopup from '@/app/components/BookingComponents/EvictionPopup';
import Tenant from '@/app/types/Tenant';

interface TenantManagementButtonsProps {
  booking: Booking;
}

const TenantManagementButtons: React.FC<TenantManagementButtonsProps> = ({ booking }) => {
  const [tenantEvictionModalVisible, setTenantEvictionModalVisible] = useState<boolean>(false);
  const { handleEviction, loading } = useBookingActions();

  const onConfirmEviction = (tenants: Tenant[]) => {
    handleEviction(tenants, booking);
    setTenantEvictionModalVisible(false);
  };

  return (
    <View>
      <Text style={styles.subtitle}>Tenant Management</Text>
      <IconButton
        onPress={() => setTenantEvictionModalVisible(true)}
        icon="person"
        text="Evict Tenant"
        iconColor={Colors.primaryBackground}
        textStyle={{ color: Colors.primaryBackground }}
        style={styles.evictButton}
        disabled={loading}
      />

      <EvictionPopup
        visible={tenantEvictionModalVisible}
        onConfirm={onConfirmEviction}
        tenant={booking.tenants}
        onClose={() => setTenantEvictionModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  subtitle: { 
    fontSize: 13, 
    fontWeight: "600", 
    marginLeft: 10,
    marginTop: 20
  },
  evictButton: {
    backgroundColor: Colors.error,
    borderWidth: 0,
    marginTop: 5,
  },
});

export default TenantManagementButtons;
