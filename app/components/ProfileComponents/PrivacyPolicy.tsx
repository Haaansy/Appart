import { View, Text, Modal, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/styles/colors';

interface PrivacyPolicyProps {
  isVisible: boolean;
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ isVisible, onClose }) => {
  const { height } = Dimensions.get('window');
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.header}>
            <Text style={styles.modalTitle}>Privacy Policy</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={[styles.scrollView, { maxHeight: height * 0.7 }]} showsVerticalScrollIndicator={true}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.paragraph}>
              Welcome to Appart's Privacy Policy. This document outlines how we collect, use, store, and protect your information when you use our mobile application.
            </Text>

            <Text style={styles.sectionTitle}>Information We Collect</Text>
            <Text style={styles.subSectionTitle}>Personal Information</Text>
            <Text style={styles.paragraph}>
              - Profile information (name, username, email address, phone number){'\n'}
              - Account credentials{'\n'}
              - Profile photos and cover images{'\n'}
              - Emergency contact information
            </Text>

            <Text style={styles.subSectionTitle}>Location Information</Text>
            <Text style={styles.paragraph}>
              We collect location data to:{'\n'}
              - Show you properties near your current location{'\n'}
              - Provide accurate directions to properties{'\n'}
              - Help you discover neighborhood amenities
            </Text>

            <Text style={styles.subSectionTitle}>Media and Storage</Text>
            <Text style={styles.paragraph}>
              - Photos you upload for your profile{'\n'}
              - Images of properties you list{'\n'}
              - Messages and communications with other users
            </Text>

            <Text style={styles.subSectionTitle}>Usage Information</Text>
            <Text style={styles.paragraph}>
              - How you interact with the app{'\n'}
              - Features you use most frequently{'\n'}
              - Search preferences and history
            </Text>

            <Text style={styles.sectionTitle}>How We Use Your Information</Text>
            <Text style={styles.paragraph}>
              - To create and maintain your account{'\n'}
              - To process property bookings and inquiries{'\n'}
              - To connect tenants with property owners{'\n'}
              - To send notifications about bookings, messages, and alerts{'\n'}
              - To improve our services based on user feedback
            </Text>

            <Text style={styles.sectionTitle}>Data Storage and Security</Text>
            <Text style={styles.paragraph}>
              - Your data is stored securely in our Firebase database{'\n'}
              - Images are stored in secure cloud storage{'\n'}
              - We implement industry-standard security measures to protect your information
            </Text>

            <Text style={styles.sectionTitle}>Third-Party Services</Text>
            <Text style={styles.paragraph}>
              Our app uses third-party services including:{'\n'}
              - Firebase for authentication and database storage{'\n'}
              - Expo for app functionality{'\n'}
              - Image picking services for photo uploads
            </Text>

            <Text style={styles.sectionTitle}>Your Rights</Text>
            <Text style={styles.paragraph}>
              You have the right to:{'\n'}
              - Access your personal information{'\n'}
              - Update or correct your data{'\n'}
              - Delete your account and associated data{'\n'}
              - Opt out of certain data collection
            </Text>

            <Text style={styles.sectionTitle}>Permissions</Text>
            <Text style={styles.paragraph}>
              Our app requests permissions for:{'\n'}
              - Location services: To find properties near you{'\n'}
              - Camera and photo library: To upload profile pictures and property images
            </Text>

            <Text style={styles.sectionTitle}>Updates to This Policy</Text>
            <Text style={styles.paragraph}>
              We may update this Privacy Policy periodically. We will notify you of any significant changes through the app.
            </Text>

            <Text style={styles.sectionTitle}>Contact Us</Text>
            <Text style={styles.paragraph}>
              If you have questions about this Privacy Policy or your data, please contact us at support@appart.com.
            </Text>

            <Text style={styles.lastUpdated}>Last Updated: May 3, 2025</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  closeButton: {
    padding: 5,
  },
  scrollView: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  lastUpdated: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  }
});

export default PrivacyPolicy;
