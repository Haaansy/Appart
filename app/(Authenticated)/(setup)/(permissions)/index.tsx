import { View, Text } from 'react-native'
import React, { useState } from 'react'
import LocationPage from './pages/LocationPage'
import PhotosPage from './pages/PhotosPage'
import CustomButton from '@/app/components/CustomButton'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'

const pages = [ LocationPage, PhotosPage ]

const Index = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  };

  const requestPhotoPermission = async () => {
    try {
      console.log('Requesting photo permissions...');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Photo permission status:', status);
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting photo permission:', error);
      return false;
    }
  };
  
  const handleNextPage = async () => {
    let permissionGranted = false;
    
    // Request the appropriate permission based on the current page
    if (currentPageIndex === 0) {
      // Location permission page
      permissionGranted = await requestLocationPermission();
      console.log('Location permission granted:', permissionGranted);
    } else if (currentPageIndex === 1) {
      // Photo permission page
      permissionGranted = await requestPhotoPermission();
      console.log('Photo permission granted:', permissionGranted);
    }
    
    // If permission is granted or this is the last page, proceed
    if (permissionGranted || currentPageIndex >= pages.length - 1) {
      if (currentPageIndex < pages.length - 1) {
        setCurrentPageIndex(currentPageIndex + 1);
      } else {
        router.push('/(Authenticated)/(tabs)/Home');
      }
    } else {
      // Permission was denied - show alert or feedback
      console.log('Permission denied for page', currentPageIndex);
      alert('This permission is required to use all app features. Please grant access in your device settings.');
    }
  };
  
  const CurrentPage = pages[currentPageIndex];
  
  return (
    <View style={{ flex: 1 }}>
      <CurrentPage />
      <View style={{ position: 'absolute', bottom: 20, width: '100%', alignItems: 'center' }}>
        <CustomButton 
          title={
        currentPageIndex === 0 ? 'Allow Location Services' :
        currentPageIndex === 1 ? 'Allow Photo Access' :
        'Finish'
          } 
          onPress={handleNextPage}
        />
      </View>
    </View>
  )
}

export default Index