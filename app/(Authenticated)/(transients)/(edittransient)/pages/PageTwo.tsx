import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from "react-native";
import MapboxGL from "@rnmapbox/maps";
import getAddress from "@/app/hooks/getAddress";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/assets/styles/colors";
import * as Location from "expo-location";

MapboxGL.setAccessToken(
  "sk.eyJ1IjoiaGFpaWFuZXhlIiwiYSI6ImNtN2lsODF3eDBoZ2wya3FwN201MDZsa2oifQ.BU1lPGsnv5cOWT-DcLEWow"
);

const { width, height } = Dimensions.get("window");

interface PageProps {
  onValidation: (isValid: boolean) => void;
  formData: any;
  updateFormData: (key: string, value: any) => void;
  inputRefs: React.MutableRefObject<{ [key: string]: TextInput | null }>;
  onInputFocus: (key: string) => void;
  onBack: () => void;
}

const PageTwo: React.FC<PageProps> = ({
  onValidation,
  formData,
  updateFormData,
  inputRefs,
  onInputFocus,
  onBack,
}) => {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(formData.coordinates);
  const { address, reverseGeocode, loading, error } = getAddress();
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("Permission to access location was denied");
          setIsLoading(false);
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const userCoordinates: [number, number] = [
          currentLocation.coords.longitude,
          currentLocation.coords.latitude,
        ];

        setLocation(userCoordinates);
        setIsLoading(false);
      } catch (error) {
        setErrorMsg("Failed to fetch location");
        setIsLoading(false);
      }
    };

    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (coordinates) {
      reverseGeocode(coordinates[0], coordinates[1]);
      updateFormData("coordinates", coordinates);
    }
  }, [coordinates]);

  useEffect(() => {
    const isValid =
      coordinates !== null && address !== null && !loading && !error;
    onValidation(isValid);
    updateFormData("address", address);
  }, [coordinates, address, loading, error]);

  const onMapPress = async (event: any) => {
    const { geometry } = event;
    if (geometry?.coordinates) {
      const newCoordinates: [number, number] = geometry.coordinates;
      setCoordinates(newCoordinates);
      await reverseGeocode(newCoordinates[0], newCoordinates[1]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginTop: 15 }}
        >
          <Ionicons
            name="chevron-back-outline"
            size={40}
            color={Colors.primaryText}
          />
          <Text style={{ fontSize: 24, fontWeight: "bold" }}>
            {" "}
            Apartment Location{" "}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView
          style={styles.map}
          onPress={onMapPress}
          zoomEnabled
          scrollEnabled
        >
          <MapboxGL.Camera
            centerCoordinate={coordinates || [0, 0]}
            zoomLevel={12}
          />

          {coordinates && (
            <MapboxGL.PointAnnotation id="marker" coordinate={coordinates}>
              <View style={styles.markerContainer}>
                <View style={styles.marker} />
              </View>
            </MapboxGL.PointAnnotation>
          )}

          {location && (
            <MapboxGL.PointAnnotation
              id="currentLocation"
              coordinate={location}
            >
              <View style={styles.markerContainer}>
                <View style={[styles.marker, { backgroundColor: "blue" }]} />
              </View>
            </MapboxGL.PointAnnotation>
          )}
        </MapboxGL.MapView>
      </View>

      <View style={styles.infoBox}>
        {loading ? (
          <ActivityIndicator size="small" color="blue" />
        ) : error ? (
          <Text style={styles.errorText}>Error: {error}</Text>
        ) : (
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="location" size={24} color={Colors.primary} />
            <Text style={styles.addressText}>
              {address || "Tap on the map to get an address"}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  map: { flex: 1, width: width, height: height * 0.5, marginVertical: 25 },
  markerContainer: { alignItems: "center", justifyContent: "center" },
  marker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "red",
    borderWidth: 2,
    borderColor: "white",
  },
  infoBox: {
    position: "absolute",
    bottom: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  addressText: { fontSize: 14, fontWeight: "600", marginLeft: 10 },
  errorText: { color: "red" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PageTwo;
