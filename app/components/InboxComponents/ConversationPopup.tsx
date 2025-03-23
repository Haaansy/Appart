import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Colors from "@/assets/styles/colors";
import Conversation from "@/app/types/Conversation";
import { router } from "expo-router";
import { FlatList } from "react-native-gesture-handler";

interface PopupProps {
  visible: boolean;
  onSelect: () => void; // Pass selected value
  onClose: () => void; // Close the popup
  bookingId: string;
  conversation: Conversation;
}

const ConversationPopup: React.FC<PopupProps> = ({
  visible,
  onSelect,
  onClose,
  bookingId,
  conversation,
}) => {
  const [showMembers, setShowMembers] = useState(false);

  console.log(conversation)
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <View style={styles.dropdown}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              onSelect();
              router.push(
                `/(Authenticated)/(bookings)/(viewbooking)/${bookingId}`
              );
            }}
          >
            <Ionicons name="eye-outline" size={20} color={Colors.primaryText} />
            <Text style={styles.menuText}>View Booking</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              setShowMembers(true);
            }}
          >
            <Ionicons
              name="person-outline"
              size={20}
              color={Colors.primaryText}
            />
            <Text style={styles.menuText}>View Members</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Members Popup */}
      <Modal transparent={true} visible={showMembers} animationType="fade">
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setShowMembers(false)}
        >
          <View style={styles.membersPopup}>
            <View style={styles.membersHeader}>
              <Text style={styles.membersTitle}>Conversation Members</Text>
              <TouchableOpacity onPress={() => setShowMembers(false)}>
                <Ionicons name="close" size={24} color={Colors.primaryText} />
              </TouchableOpacity>
            </View>
            {conversation.members.length > 0 && (
              <FlatList
              data={conversation.members}
              keyExtractor={(member) => member.user.id as string}
              renderItem={({ item }) => (
                <View style={styles.memberItem}>
                  <Ionicons name="person" size={20} color={Colors.primaryText} />
                  <Text style={styles.memberName}>@{item.user.displayName}</Text>
                </View>
              )}
            />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    position: "absolute",
    top: 75, // Positioned below the header
    right: 20,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 220,
    paddingVertical: 5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.primaryText,
  },
  membersPopup: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: Colors.primaryBackground,
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  membersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border || '#eee',
  },
  membersTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primaryText,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  memberName: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.primaryText,
  },
});

export default ConversationPopup;
