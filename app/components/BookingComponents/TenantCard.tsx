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
import { UserData } from "@/app/types/UserData";
import { Tenant } from "@/app/types/Tenant";

interface TenantCardProps {
  tenant: Tenant;
  onPress?: () => void;
}

const TenantCard: React.FC<TenantCardProps> = ({ tenant }) => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        {/* User Image */}
        <Image source={{ uri: tenant.user.photoUrl }} style={styles.image} />

        {/* User Name */}
        <View>
          <Text
            style={styles.name}
          >{`${tenant.user.firstName} ${tenant.user.lastName}`}</Text>
          <Text
            style={styles.displayName}
          >{`@${tenant.user.displayName}`}</Text>
        </View>

        {/* Forward Icon */}
        <View style={{ flex: 1, alignItems: "flex-end" }}>
          {tenant.status === "Host" ? (
            <Text style={{ color: Colors.primary }}>Host</Text>
          ) : (
            <TouchableOpacity>
              <Ionicons
                name="chevron-forward"
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
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

export default TenantCard;
