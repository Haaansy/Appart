import Apartment from "@/app/types/Apartment";
import Transient from "@/app/types/Transient";
import Colors from "@/assets/styles/colors";
import { View, TouchableOpacity, Image, Text, StyleSheet } from "react-native";

interface PropertyCardProps {
  property: Apartment | Transient;
  onPress: () => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <View key={property.id} style={styles.propertyCard}>
      <Image
        source={{ uri: property.images[0] }}
        style={styles.propertyImage}
      />
      <View style={styles.propertyInfo}>
        <Text style={styles.propertyName}>{property.title}</Text>
        <Text style={styles.propertyAddress}>{property.address}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.editButton]}
            onPress={() => {}}
          >
            <Text style={styles.editButtonText}>View Details</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.messageButton]}
            onPress={() => {}}
          >
            <Text style={styles.messageButtonText}>Message Tenant</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundVector: {
    height: "90%",
    width: "100%",
    resizeMode: "stretch",
    position: "absolute",
    top: -350,
    backgroundColor: Colors.secondaryBackground,
  },
  icon: {
    width: 60,
    height: 60,
    resizeMode: "cover",
  },
  greetings: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryBackground,
  },
  subtext: {
    fontSize: 12,
    fontWeight: "regular",
    color: Colors.primaryBackground,
  },
  topBar: {
    flexDirection: "row",
    marginTop: 65,
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
  },
  propertyCard: {
    backgroundColor: Colors.primaryBackground,
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  propertyImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  propertyInfo: {
    padding: 15,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  propertyAddress: {
    fontSize: 14,
    color: "#777",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    flexDirection: "row",
  },
  editButton: {
    backgroundColor: "#f0f0f0",
  },
  messageButton: {
    backgroundColor: Colors.primary,
    position: "relative",
  },
  editButtonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  messageButtonText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
  },
  unreadBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff3b30",
  },
  addPropertyButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginVertical: 10,
  },
  addPropertyText: {
    color: Colors.primary,
    fontWeight: "600",
    fontSize: 16,
  },
  emptyText: {
    textAlign: "center",
    padding: 20,
    color: "#777",
    fontStyle: "italic",
  },
  switchContainer: {
    marginTop: 20,
  },
  tabContent: {
    paddingTop: 15,
  },
});

export default PropertyCard;
