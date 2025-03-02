import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Colors from '@/assets/styles/colors'

interface DurationCardProps {
    duration: number
}

const DurationCard: React.FC<DurationCardProps>  = ({
    duration
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.durationText}>{duration}</Text>
      <Text style={styles.monthText}>{`Month${ duration > 1 ? "s":""}`}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    width: 120,
    height: 120,
    borderRadius: 10,
    marginTop: 15,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  durationText: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
  monthText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    position: "absolute",
    bottom: 10,
    right: 10
  }
})


export default DurationCard