import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as DocumentPicker from 'expo-document-picker'
import { uploadBusinessPermit } from '@/app/Firebase/Services/StorageService'
import { fetchUserDataFromFirestore, updateUserData } from '@/app/Firebase/Services/DatabaseService'
import getCurrentUserData from '@/app/hooks/users/getCurrentUserData'
import refreshCurrentUserData from '@/app/hooks/users/refreshCurrentUserData'
import UserData from '@/app/types/UserData'
import { useRouter } from 'expo-router'

const Verification = () => {
  const [ currentUserData, setCurrentUserData] = useState<UserData>()
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null)
  const [Loading, setLoading] = useState<Boolean>(false);
  const [uploading, setUploading] = useState(false);
  const Router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      await refreshCurrentUserData();
      const user = await getCurrentUserData();
      if (user) {
        setCurrentUserData(user);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: true,
      multiple: false,
    })
    if (result.assets && result.assets.length > 0 && result.canceled === false) {
      setFile(result.assets[0])
    }
  }

  const handleSubmit = async () => {
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadBusinessPermit(file.uri)
      setUploading(false)
      setFile(null)
      if (url) {
        updateUserData(currentUserData?.id as string, { businessPermitURL: url, isVerifying: true, verified: false})
        Router.push("/(Authenticated)/(tabs)/Home")
      } else {
        alert('Failed to upload business permit. Please try again.')
      }
    } catch (e) {
      setUploading(false)
      alert('An error occurred during upload.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Business Permit Verification</Text>
      <Text style={styles.subtitle}>
        Please upload your business permit in pdf form to verify your property ownership.
      </Text>
      <TouchableOpacity style={styles.uploadBtn} onPress={pickDocument}>
        <Text style={styles.uploadBtnText}>
          {file ? 'Change File' : 'Select Business Permit'}
        </Text>
      </TouchableOpacity>
      {file && (
        <Text style={styles.fileName}>Selected: {file.name}</Text>
      )}
      <TouchableOpacity
        style={[styles.submitBtn, (!file || uploading) && styles.disabledBtn]}
        onPress={handleSubmit}
        disabled={!file || uploading}
      >
        <Text style={styles.submitBtnText}>
          {uploading ? 'Submitting...' : 'Submit for Verification'}
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default Verification

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 24,
    textAlign: 'center',
  },
  uploadBtn: {
    backgroundColor: '#1976D2',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  fileName: {
    fontSize: 14,
    color: '#333',
    marginBottom: 18,
    textAlign: 'center',
  },
  submitBtn: {
    backgroundColor: '#388E3C',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
  },
  disabledBtn: {
    backgroundColor: '#bdbdbd',
  },
})