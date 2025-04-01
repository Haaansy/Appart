import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import Colors from "@/assets/styles/colors"; // Import your colors
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo
import Review from "@/app/types/Review";

const { width } = Dimensions.get("window");

interface ApartmentCardsProps {
  images: string[];
  title: string;
  address: string;
  price: number;
  reviews: Review[];
  onPress: () => void;
}

const ApartmentCards: React.FC<ApartmentCardsProps> = ({
  images = [[]], // Default to prevent errors
  title,
  address,
  price,
  reviews = [],
  onPress,
}) => {
  const flatListRef = useRef<FlatList<string> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const imageList = images.flat(); // Flatten in case of nested array

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / (width * 0.9)); // Adjusted to match snap interval
    setActiveIndex(index);
  };

  // Format price as PHP currency
  const formattedPrice = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 0, // Removes decimals for cleaner display
  }).format(price);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: images[0] as string }} style={styles.image} />
        </View>

        {/* Apartment Details */}
        <View style={styles.contents}>
          <View>
            <Text style={styles.title}>{title}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                flex: 1,
              }}
            >
              <Ionicons
                name="star"
                size={16}
                color={Colors.primary}
                style={{ marginRight: 5 }}
              />
              <Text style={styles.address}>
              { reviews && reviews.length > 0 ? (
                  reviews.reduce((sum: any, review: any) => sum + review.rating, 0) / reviews.length
                ).toFixed(1)
                : (
                  "No reviews"
                ) }
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "flex-start",
              marginTop: 15
            }}
          >
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.address}>{address}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              marginTop: 15
            }}
          >
            <Text style={styles.price}>{formattedPrice}</Text>
            <Text style={{ fontSize: 10, marginLeft: 3 }}>/mo</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 25,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginVertical: 15
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: width * 0.9, // Ensures correct snap width
    height: 250, // Fixed height for consistency
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    resizeMode: "cover",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 20, // Adjusts the position on top
    alignSelf: "center", // Centers the dots horizontally
    flexDirection: "row",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  address: {
    fontSize: 14,
    color: "gray",
    marginLeft: 5
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.primaryText,
    textAlign: "right",
    alignContent: "flex-end",
  },
  contents: {
    paddingHorizontal: 25,
    paddingVertical: 25,
    justifyContent: "space-around",
    alignContent: "space-around",
  },
});

export default ApartmentCards;
