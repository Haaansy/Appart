import { View, Text, StyleSheet, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Apartment } from "@/app/types/Apartment";
import PropertyCard from "@/app/components/BookingComponents/PropertyCard";
import IconButton from "@/app/components/IconButton";
import Colors from "@/assets/styles/colors";
import TenantCard from "@/app/components/BookingComponents/TenantCard";
import { UserData } from "@/app/types/UserData";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import { Tenant } from "@/app/types/Tenant";

interface ApartmentProps {
  apartment: Apartment;
}

const ApartmentScreen: React.FC<ApartmentProps> = ({ apartment }) => {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [currentUser, setCurrentUser] = useState<UserData>({} as UserData);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const userData = await getStoredUserData();
  
        if (userData) {
          setCurrentUser(userData);
          const hostData: Tenant = { user: userData, status: "Host" };
  
          setTenants((prev) => [...prev, hostData]); // ✅ Ensure type safety
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
  
    fetchCurrentUser();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        <PropertyCard
          image={apartment.images[0]}
          isApartment={true}
          title={apartment.title}
          status={apartment.status}
          bedRooms={apartment.bedRooms}
          bathRooms={apartment.bathRooms}
          livingRooms={apartment.livingRooms}
          kitchen={apartment.kitchen}
          pax={apartment.maxTentants}
          levels={apartment.levels}
          area={apartment.area}
        />
        <View style={styles.line} />
        <Text style={styles.title}> Booking Details </Text>
        <Text style={styles.subtitle}>Tenant</Text>
        <Text style={styles.description}>
          *Invited Tenants should accept the invitation before the booking gets
          forwarded to the owner.
        </Text>
        {tenants.map((tenant) => (
          <TenantCard tenant={tenant} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginVertical: 10,
  },
  line: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "semibold",
    marginLeft: 10,
  },
  description: {
    fontSize: 12,
    marginLeft: 20,
  },
  inviteButton: {
    marginTop: 10,
    borderColor: Colors.primary,
    borderWidth: 1,
  },
});

export default ApartmentScreen;
