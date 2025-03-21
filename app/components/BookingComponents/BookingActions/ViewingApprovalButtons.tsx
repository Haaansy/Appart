import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '@/assets/styles/colors';
import IconButton from '@/app/components/IconButton';
import { useBookingActions } from '@/app/hooks/bookings/useBookingActions';
import Booking from '@/app/types/Booking';
import Apartment from '@/app/types/Apartment';
import UserData from '@/app/types/UserData';

interface ViewingApprovalButtonsProps {
  booking: Booking;
  apartment: Apartment;
  currentUserData: UserData;
  ownerData: UserData;
}

const ViewingApprovalButtons: React.FC<ViewingApprovalButtonsProps> = ({
  booking,
  apartment,
  currentUserData,
  ownerData,
}) => {
  const { handleViewingApproval, loading } = useBookingActions();

  return (
    <View>
      <Text style={styles.subtitle}>Viewing Approval</Text>
      <IconButton
        onPress={() => handleViewingApproval(booking, apartment, currentUserData, ownerData)}
        icon="eye"
        text="Approve Viewing"
        iconColor={Colors.primaryBackground}
        textStyle={{ color: Colors.primaryBackground }}
        style={styles.approveButton}
        disabled={loading}
      />
      <IconButton
        onPress={() => {}}
        icon="close"
        text="Decline Viewing"
        iconColor={Colors.primaryBackground}
        textStyle={{ color: Colors.primaryBackground }}
        style={styles.declineButton}
        disabled={loading}
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
  approveButton: {
    backgroundColor: Colors.primary,
    borderWidth: 0,
    marginTop: 5,
  },
  declineButton: {
    backgroundColor: Colors.error,
    borderWidth: 0,
    marginTop: 5,
  },
});

export default ViewingApprovalButtons;
