import { View, Text } from 'react-native'
import React from 'react'
import { Booking } from '@/app/types/Booking'

interface BookingCardProps {
    booking: Booking
}

const BookingCard: React.FC<BookingCardProps> = ({
    booking
}) => {
  return (
    <View>
      <Text>{booking.id}</Text>
    </View>
  )
}

export default BookingCard