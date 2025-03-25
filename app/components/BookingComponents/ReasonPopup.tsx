import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import CustomTextArea from '../CustomTextArea'

interface ReasonPopupProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
  title?: string;
}

const ReasonPopup = ({ visible, onClose, onSubmit, title = "Enter Reason"}: ReasonPopupProps) => {
  const [reason, setReason] = useState('');
  const [remainingChars, setRemainingChars] = useState(100);

  const handleTextChange = (text: string) => {
    setReason(text);
    setRemainingChars(100 - text.length);
  };

  const handleSubmit = () => {
    onSubmit(reason);
    setReason('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          
          <CustomTextArea
            value={reason}
            onChangeText={handleTextChange}
            maxLength={100}
            placeholder="Enter your reason here..."
            multiline={true}
          />
          
          <Text style={styles.charCounter}>
            {remainingChars} characters remaining
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.submitButton, !reason.trim() && styles.disabledButton]} 
              onPress={handleSubmit}
              disabled={!reason.trim()}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  charCounter: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#007bff',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#333',
  },
});

export default ReasonPopup