import { View, Text } from 'react-native'
import React, { useState } from 'react'
import LocationPage from './pages/LocationPage'
import PhotosPage from './pages/PhotosPage'
import CustomButton from '@/app/components/CustomButton'
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker'

const pages = [ LocationPage, PhotosPage ]

const Index = () => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  };

  const requestPhotoPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };
  
  const handleNextPage = async () => {
    let permissionGranted = false;
    
    // Request the appropriate permission based on the current page
    if (currentPageIndex === 0) {
      // Location permission page
      permissionGranted = await requestLocationPermission();
    } else if (currentPageIndex === 1) {
      // Photo permission page
      permissionGranted = await requestPhotoPermission();
    }
    
    // If permission is granted or this is not a permission page, go to next page
    if (permissionGranted || currentPageIndex >= pages.length - 1) {
      if (currentPageIndex < pages.length - 1) {
        setCurrentPageIndex(currentPageIndex + 1);
      }
    } else {
      // Permission was denied - could add error handling here
      console.log('Permission denied');
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