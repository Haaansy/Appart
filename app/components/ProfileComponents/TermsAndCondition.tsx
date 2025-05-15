import { View, Text, Modal, ScrollView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/assets/styles/colors';

interface TermsAndConditionProps {
  isVisible: boolean;
  onClose: () => void;
}

const TermsAndCondition: React.FC<TermsAndConditionProps> = ({ isVisible, onClose }) => {
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
            <Text style={styles.modalTitle}>Terms and Conditions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={[styles.scrollView, { maxHeight: height * 0.7 }]} showsVerticalScrollIndicator={true}>
            <Text style={styles.sectionTitle}>Introduction</Text>
            <Text style={styles.paragraph}>
              These Terms and Conditions govern your use of our application and constitute a legally binding agreement between you and the application provider.
            </Text>

            <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
            <Text style={styles.paragraph}>
              By downloading, installing, accessing, or using our application, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the application.
            </Text>

            <Text style={styles.sectionTitle}>Changes to Terms</Text>
            <Text style={styles.paragraph}>
              We reserve the right to modify these terms at any time. Any changes will be effective immediately upon posting the updated terms. Your continued use of the application constitutes your acceptance of any changes.
            </Text>

            <Text style={styles.sectionTitle}>Privacy Policy</Text>
            <Text style={styles.paragraph}>
              Your use of the application is also governed by our Privacy Policy, which is incorporated into these Terms and Conditions by reference.
            </Text>

            <Text style={styles.sectionTitle}>User Accounts</Text>
            <Text style={styles.paragraph}>
              - You are responsible for maintaining the confidentiality of your account information{'\n'}
              - You are responsible for all activities that occur under your account{'\n'}
              - You must notify us immediately of any unauthorized use of your account
            </Text>

            <Text style={styles.sectionTitle}>Prohibited Conduct</Text>
            <Text style={styles.paragraph}>
              You agree not to:{'\n'}
              - Use the application for any illegal purpose{'\n'}
              - Violate any applicable laws or regulations{'\n'}
              - Interfere with the proper working of the application{'\n'}
              - Attempt to bypass any security measures
            </Text>

            <Text style={styles.sectionTitle}>Intellectual Property</Text>
            <Text style={styles.paragraph}>
              All content, features, and functionality of the application are owned by us and are protected by copyright, trademark, and other intellectual property laws.
            </Text>

            <Text style={styles.sectionTitle}>Termination</Text>
            <Text style={styles.paragraph}>
              We may terminate or suspend your access to the application immediately, without prior notice, for any reason.
            </Text>

            <Text style={styles.sectionTitle}>Disclaimer of Warranties</Text>
            <Text style={styles.paragraph}>
              The application is provided "as is" without warranties of any kind, either express or implied.
            </Text>

            <Text style={styles.sectionTitle}>Limitation of Liability</Text>
            <Text style={styles.paragraph}>
              In no event shall we be liable for any damages arising out of the use or inability to use the application.
            </Text>

            <Text style={styles.sectionTitle}>Governing Law</Text>
            <Text style={styles.paragraph}>
              These Terms shall be governed by and construed in accordance with the laws of Philippines.
            </Text>

            <Text style={styles.sectionTitle}>Contact Information</Text>
            <Text style={styles.paragraph}>
              If you have any questions about these Terms, please contact us at cs@appart.app.
            </Text>

            <Text style={styles.lastUpdated}>Last updated: May 3, 2025</Text>
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

export default TermsAndCondition;
