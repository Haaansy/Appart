import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import Colors from "@/assets/styles/colors";

interface PropertyCardProps {
  isApartment: boolean;
  title: string;
  status: string;
  bedRooms: number;
  bathRooms: number;
  livingRooms: number;
  kitchen: number;
  pax: number;
  area?: number;
  levels?: number;
  image: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  isApartment,
  title,
  status,
  bedRooms,
  bathRooms,
  livingRooms,
  kitchen,
  pax,
  area,
  levels,
  image,
}) => {
  return (
    <View style={{ flexDirection: "row"}}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={{ flex: 1, paddingHorizontal: 15, paddingVertical: 15 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontWeight: "bold"}}>{title}</Text>
          <Text style={{ fontSize: 12 }}>{status}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 12 }}>{`${bedRooms} Bed room/s`}</Text>
          <Text style={{ fontSize: 12 }}>{`${livingRooms} Living room/s`}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 12 }}>{`${bathRooms} Bath room/s`}</Text>
          <Text style={{ fontSize: 12 }}>{`${kitchen} Kitchen/s`}</Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 12 }}>{`Up to ${pax} pax`}</Text>
          { isApartment && <Text style={{ fontSize: 12 }}>{`${levels} Level/s`}</Text>}
        </View>
        { isApartment && <Text style={{ fontSize: 12 }}>{`${area} sqm/s`}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: Colors.primary,
    width: 120,
    height: 120,
    borderRadius: 15
  }
});

export default PropertyCard;
