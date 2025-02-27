import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  Touchable,
  TouchableOpacity,
} from "react-native";
import Colors from "@/assets/styles/colors"; // Import your colors
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons from Expo

const { width } = Dimensions.get("window");

interface TransientCardProps {
  images: string[];
  title: string;
  address: string;
  price: number;
  rating?: number;
  onPress?: () => void;
}

const TransientCard: React.FC<TransientCardProps> = ({
  images = [[]], // Default to prevent errors
  title,
  address,
  price,
  rating,
  onPress
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
          {/* Image Carousel */}
          <FlatList
            ref={flatListRef}
            data={imageList}
            horizontal
            pagingEnabled
            onScroll={handleScroll}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => item + index}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
            snapToAlignment="center"
            snapToInterval={width * 0.9} // Snaps to each image width
            decelerationRate="fast"
          />

          {/* Dots Indicator (Overlayed on Image) */}
          <View style={styles.dotsContainer}>
            {imageList.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      activeIndex === index ? Colors.primary : "white",
                  },
                ]}
              />
            ))}
          </View>
        </View>

        {/* Apartment Details */}
        <View style={styles.contents}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.title}>{title}</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "flex-end",
                flex: 1,
              }}
            >
              <Ionicons
                name="star"
                size={16}
                color={Colors.primary}
                style={{ marginRight: 5 }}
              />
              <Text style={styles.address}>4.6(3)</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Ionicons name="location" size={16} color={Colors.primary} />
            <Text style={styles.address}>{address}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "flex-end",
            }}
          >
            <Text style={styles.price}> {formattedPrice} </Text>
            <Text style={{ fontSize: 10, marginLeft: 3 }}>/night</Text>
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
    marginTop: 5,
    fontSize: 14,
    color: "gray",
  },
  price: {
    fontSize: 16,
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

export default TransientCard;
