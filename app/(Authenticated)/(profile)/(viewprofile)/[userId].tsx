import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const index = () => {
  const { userId } = useLocalSearchParams()

  return (
    <View>
      <Text>{userId}</Text>
    </View>
  )
}

export default index