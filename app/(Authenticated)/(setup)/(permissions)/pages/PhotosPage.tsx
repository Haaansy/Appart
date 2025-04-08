import { View, Text, StyleSheet, TouchableOpacity, Dimensions, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import Colors from '../../../../../assets/styles/colors'
import * as ImagePicker from 'expo-image-picker'
import { useRouter } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('window')

const PhotosPage = () => {
  const [photoPermission, setPhotoPermission] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Hide the status bar when component mounts
    StatusBar.setHidden(true)
    checkPhotoPermission()
    
    // Show the status bar when component unmounts
    return () => {
      StatusBar.setHidden(false)
    }
  }, [])

  const checkPhotoPermission = async () => {
    const { status } = await ImagePicker.getMediaLibraryPermissionsAsync()
    setPhotoPermission(status === 'granted')
  }

  return (
    <View style={styles.container}>
      {/* Background Elements */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      <LinearGradient
        colors={['rgba(30, 136, 229, 0.1)', 'rgba(30, 136, 229, 0)']}
        style={styles.backgroundGradient}
      />
      
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Photos Access</Text>
      </View>
      
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="images" size={80} color={Colors.buttonPrimary} />
        </View>
        
        <Text style={styles.title}>Enable Photos Access</Text>
        
        <Text style={styles.description}>
          Allow access to your photos to upload profile pictures, listing photos, and share images with other users.
        </Text>
        
        <View style={styles.featureContainer}>
          <View style={styles.feature}>
            <Ionicons name="person-circle" size={22} color={Colors.buttonPrimary} style={styles.featureIcon} />
            <Text style={styles.featureText}>Update your profile picture</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="home" size={22} color={Colors.buttonPrimary} style={styles.featureIcon} />
            <Text style={styles.featureText}>Upload apartment photos</Text>
          </View>
          <View style={styles.feature}>
            <Ionicons name="chatbubbles" size={22} color={Colors.buttonPrimary} style={styles.featureIcon} />
            <Text style={styles.featureText}>Share images in messages</Text>
          </View>
        </View>

        {photoPermission === false && (
          <Text style={styles.errorText}>
            Photos permission is needed for the best experience.
          </Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
  },
  backgroundCircle1: {
    position: 'absolute',
    top: -height * 0.25,
    right: -width * 0.25,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: 'rgba(30, 136, 229, 0.08)',
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: -width * 0.4,
    left: -width * 0.3,
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: 'rgba(30, 136, 229, 0.05)',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: height * 0.4,
  },
  headerContainer: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
    paddingBottom: 50,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(30, 136, 229, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  featureContainer: {
    width: '100%',
    marginBottom: 30,
    backgroundColor: 'rgba(245, 245, 245, 0.7)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    color: Colors.secondaryText,
  },
  button: {
    backgroundColor: Colors.buttonPrimary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  buttonSuccessState: {
    backgroundColor: Colors.success,
  },
  buttonText: {
    color: Colors.primaryBackground,
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: Colors.error,
    marginTop: 8,
    textAlign: 'center',
  },
  skipButton: {
    marginTop: 20,
    padding: 10,
  },
  skipText: {
    color: Colors.secondaryText,
    fontSize: 14,
  }
})

export default PhotosPage