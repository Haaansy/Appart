import Tenant from "@/app/types/Tenant";
import Colors from "@/assets/styles/colors";
import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import CustomInputWithButton from "../CustomInputButton";
import TenantCard from "./TenantCard";
import {
  fetchTenantByDisplayName,
  updateBooking,
} from "@/app/Firebase/Services/DatabaseService";
import { useFocusEffect } from "expo-router";
import EvictionCard from "./EvictionCard";
import Booking from "@/app/types/Booking";
import { Ionicons } from "@expo/vector-icons";

interface PopupProps {
  visible: boolean;
  onConfirm: (tenant: Tenant[]) => void; // Pass selected value
  tenant: Tenant[];
  onClose: () => void;
}

const EvictionPopup: React.FC<PopupProps> = ({
  visible,
  onConfirm,
  tenant,
  onClose,
}) => {
  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    setTenants([...tenant]);
    setLoading(false);
  }, [tenant]);

  const handleDelete = (tenant: Tenant) => {
    Alert.alert(
      "Confirm Eviction",
      "Are you sure you want to evict this tenant?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Evict",
          style: "destructive",
          onPress: async () => {
            const tenantIndex = tenants.findIndex(
              (t) => t.user === tenant.user
            );

            if (tenantIndex === -1) return; // Tenant not found, exit

            let updatedTenants = [...tenants];

            // If the evicted tenant is the Host, transfer the status
            if (tenant.status === "Host" && updatedTenants.length > 1) {
              let nextIndex = tenantIndex === 0 ? 1 : 0; // Start with the next available tenant
              
              // Find the next tenant who is not evicted
              while (nextIndex < updatedTenants.length && updatedTenants[nextIndex].status === "Evicted") {
                nextIndex++;
              }
            
              if (nextIndex < updatedTenants.length) {
                updatedTenants[nextIndex].status = "Host"; // Assign Host role to the first non-evicted tenant
              }
            }            

            // Remove the tenant from the list
            // Change tenant status to "Evicted" instead of removing them
            updatedTenants[tenantIndex] = {
              ...updatedTenants[tenantIndex],
              status: "Evicted",
            };
            
            setTenants(updatedTenants);
            onConfirm(updatedTenants);
          },
        },
      ]
    );
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <TouchableOpacity>
              <Ionicons
                name="chevron-back"
                size={35}
                color="black"
                onPress={onClose}
              />
            </TouchableOpacity>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.message}>Evict Tenant</Text>
              <Text style={styles.submessage}>
                Evict Tenant from the property.
              </Text>
            </View>
          </View>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            tenants.map((tenant, index) => {
              return (
                <EvictionCard
                  key={index}
                  tenant={tenant}
                  onDelete={() => handleDelete(tenant)}
                  deleteButton
                />
              );
            })
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    width: 400,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
  },
  message: {
    fontSize: 28,
    fontWeight: "semibold",
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "40%",
  },
  cancelButton: {
    marginTop: 10,
    borderColor: Colors.error,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "40%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  submessage: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
});

export default EvictionPopup;
