import Tenant from "@/app/types/Tenant";
import Colors from "@/assets/styles/colors";
import React, { useEffect } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomInputWithButton from "../CustomInputButton";
import TenantCard from "./TenantCard";
import { fetchTenantByDisplayName } from "@/app/Firebase/Services/DatabaseService";
import { useFocusEffect } from "expo-router";

interface PopupProps {
  visible: boolean;
  onConfirm: (tenant: Tenant[]) => void; // Pass selected value
  tenant: Tenant[];
  onClose: () => void;
  maxTenants: number;
}

const TenantPopup: React.FC<PopupProps> = ({ visible, onConfirm, tenant, onClose, maxTenants }) => {
  const [tenants, setTenants] = React.useState<Tenant[]>([]);
  const [displayNameInput, setDisplayNameInput] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(true);

  useEffect(() => {
    setTenants([...tenant]);
    setLoading(false);
  }, [tenant]);

  const handleInviteButton = async () => {
    setLoading(true);
    if (!displayNameInput.trim()) return; // Prevent empty input

    try {
      
      if (tenants.length >= maxTenants) {
        console.log("Max tenants reached");
        return;
      }

      const newTenant = await fetchTenantByDisplayName(displayNameInput.trim());

      if (newTenant) {
        if(newTenant.role === "home owner") {
          console.log("Home owner cannot be invited as tenant");
          return;
        } 

        if(tenants.find(t => t.user.id === newTenant.id)) {
          console.log("Tenant already invited");
          return;
        }

        setTenants((prev: Tenant[]) => [
          ...prev,
          { user: newTenant, status: "Invited" }, // Ensure user has full UserData properties
        ]);

        setDisplayNameInput(""); // Clear input after processing
      } else {
        console.log("Tenant not found");
      }

      setLoading(false);
      setDisplayNameInput(""); // Clear input after processing
    } catch (error) {
      console.error("Error fetching tenant:", error);
    }
  };

  const handleDelete = (index: number) => {
    const newTenants = [...tenants];
    newTenants.splice(index, 1);
    setTenants(newTenants);
  }

  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.message}>Invite Tenant</Text>
          <Text style={styles.submessage}>
            Invite people to include them in your booking.
          </Text>
          <CustomInputWithButton
            placeholder={"Enter Username"}
            buttonTitle={"+"}
            onButtonPress={handleInviteButton}
            value={displayNameInput}
            onChangeText={setDisplayNameInput}
            disabled={!displayNameInput.trim()}
          />
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            tenants.map((tenant, index) => {
              return <TenantCard key={index} tenant={tenant} onDelete={() => handleDelete(index)} deleteButton/>;
            })
          )}
          <View style={{ marginTop: 10, flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={[styles.buttonText, {color: Colors.error}]} onPress={() => {
                setTenants([...tenant]);
                onClose();
              }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton}>
              <Text style={styles.buttonText} onPress={() => {
                onConfirm(tenants)
                setTenants([...tenant]);
              }}>
                Confirm
              </Text>
            </TouchableOpacity>
          </View>
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
    width: "40%"
  },
  cancelButton: {
    marginTop: 10,
    borderColor: Colors.error,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "40%"
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

export default TenantPopup;
