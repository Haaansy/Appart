import {
  View,
  Text,
  Image,
  StyleSheet,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/assets/styles/colors"; // Import your color styles
import UserData from "@/app/types/UserData";
import Tenant from "@/app/types/Tenant";

interface TenantCardProps {
  tenant: Tenant;
  onPress?: () => void;
  onDelete?: () => void;
  deleteButton?: boolean;
}

const EvictionCard: React.FC<TenantCardProps> = ({
  tenant,
  onPress,
  onDelete,
  deleteButton = false,
}) => {
  return (
    <View style={styles.container}>
      {/* User Image */}
      <Image source={{ uri: tenant.user.photoUrl }} style={styles.image} />

      {/* User Name */}
      <View>
        <Text
          style={styles.name}
        >{`${tenant.user.firstName} ${tenant.user.lastName}`}</Text>
        <Text style={styles.displayName}>{`@${tenant.user.displayName}`}</Text>
      </View>

      {/* Forward Icon */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        {tenant.status === "Host" && (
          <Text style={{ color: Colors.primary, marginHorizontal: 5 }}>
            Host
          </Text>
        )}
        {tenant.status === "Evicted" && (
          <Text style={{ color: Colors.error, marginHorizontal: 5 }}>
            Evicted
          </Text>
        )}
        {tenant.status !== "Evicted" && deleteButton && (
          <TouchableOpacity onPress={onDelete}>
            <Ionicons name="trash" size={24} color={Colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.primaryBackground,
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: Colors.primary,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: "semibold",
    color: Colors.primaryText,
  },
  displayName: {
    fontSize: 14,
    color: Colors.secondaryText,
  },
});

export default EvictionCard;
