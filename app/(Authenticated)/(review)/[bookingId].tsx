import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams } from 'expo-router'
import useBooking from '@/app/hooks/bookings/useBooking'
import Booking from '@/app/types/Booking'

const index = () => {
    const { bookingId } = useLocalSearchParams()
    const { bookingData, propertyData, loading, error } = useBooking(String(bookingId))
  return (
    <View>
      <Text>{ bookingData?.type }</Text>
    </View>
  )
}

export default index