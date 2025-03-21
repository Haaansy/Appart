import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import Colors from '@/assets/styles/colors';
import IconButton from '@/app/components/IconButton';
import { useBookingActions } from '@/app/hooks/bookings/useBookingActions';
import Booking from '@/app/types/Booking';
import UserData from '@/app/types/UserData';

interface InvitationResponseButtonsProps {
  booking: Booking;
  currentUserData: UserData;
}

const InvitationResponseButtons: React.FC<InvitationResponseButtonsProps> = ({
  booking,
  currentUserData,
}) => {
  const { handleInvitation, loading } = useBookingActions();

  return (
    <View>
      <Text style={styles.subtitle}>Booking Actions</Text>
      <IconButton
        onPress={() => handleInvitation("Accepted", booking, currentUserData)}
        icon="checkmark"
        text="Accept Invitation"
        iconColor={Colors.primaryBackground}
        textStyle={{ color: Colors.primaryBackground }}
        style={styles.acceptButton}
        disabled={loading}
      />
      <IconButton
        onPress={() => handleInvitation("Declined", booking, currentUserData)}
        icon="close"
        text="Decline Invitation"
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
  acceptButton: {
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

export default InvitationResponseButtons;
