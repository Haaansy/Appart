import React, { useState, useRef } from "react";
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, GestureResponderEvent } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const index = () => {
  const { imageuri } = useLocalSearchParams();
  const [scale, setScale] = useState(1);
  const [lastTap, setLastTap] = useState<number | null>(null);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);
  const [initialScale, setInitialScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [pinchMidpoint, setPinchMidpoint] = useState({ x: 0, y: 0 });
  const [lastPinchMidpoint, setLastPinchMidpoint] = useState({ x: 0, y: 0 });

  // Function to calculate distance between two touches
  const getDistance = (touches: GestureResponderEvent["nativeEvent"]["touches"]) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.pageX - touch1.pageX, 2) +
      Math.pow(touch2.pageY - touch1.pageY, 2)
    );
  };

  // Calculate midpoint between two touch points
  const getMidpoint = (touches: GestureResponderEvent["nativeEvent"]["touches"]) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.pageX + touch2.pageX) / 2,
      y: (touch1.pageY + touch2.pageY) / 2
    };
  };

  // Improved constraint function to ensure image stays visible vertically
  const constrainPosition = (pos: { x: number, y: number }, currentScale: number) => {
    // When scale is 1, position should always be centered
    if (currentScale <= 1) {
      return { x: 0, y: 0 };
    }
    
    // Calculate maximum allowed panning distance based on scale
    // Add a small buffer to ensure some part of the image is ALWAYS visible
    const maxOffsetX = Math.max(0, (width * (currentScale - 1)) / 2);
    const maxOffsetY = Math.max(0, (height * (currentScale - 1)) / 2);
    
    // Restrict vertical movement more aggressively
    // Use a smaller value for vertical constraints if needed
    const verticalConstraintFactor = 0.9; // 90% of the calculated max
    const adjustedMaxOffsetY = maxOffsetY * verticalConstraintFactor;
    
    return {
      x: Math.max(-maxOffsetX, Math.min(maxOffsetX, pos.x)),
      y: Math.max(-adjustedMaxOffsetY, Math.min(adjustedMaxOffsetY, pos.y))
    };
  };

  // Ensure imageUri is a string
  const uri = Array.isArray(imageuri) ? imageuri[0] : imageuri;

  // Handle undefined imageUri
  if (!uri) {
    return (
      <View style={styles.container}>
        <Text>No image available</Text>
      </View>
    );
  }

  // Ensure URL has proper protocol
  let finalUri = uri;
  if (!finalUri.startsWith('http://') && !finalUri.startsWith('https://')) {
    finalUri = 'https://' + finalUri.replace(/^[a-z]+:\/\//, '');
  }

  console.log("Processing URL:", finalUri);

  // Replace standard slashes with encoded slashes in the path part only
  const urlParts = finalUri.split('/');
  const domain = urlParts.slice(0, 3).join('/'); // http://example.com
  const path = urlParts.slice(3).join('/');

  // Replace slashes in the path for both apartments and transient paths
  let encodedPath = path;
  
  // Updated regex to handle both singular and plural forms
  encodedPath = encodedPath.replace(/\/apartments\/([^\/]+)\//, '/apartments%2F$1%2F');
  encodedPath = encodedPath.replace(/\/transients?\/([^\/]+)\//, '/transients%2F$1%2F');

  // Combine everything back
  finalUri = domain + '/' + encodedPath;
  
  console.log("Final processed URL:", finalUri);

  // Handle double tap and pinch events
  const handleTouchStart = (event: GestureResponderEvent) => {
    const now = Date.now();
    // Double tap detection
    if (event.nativeEvent.touches.length === 1) {
      if (lastTap && now - lastTap < 300) {
        // Double tap occurred
        setScale(scale === 1 ? 2 : 1);
        if (scale > 1) {
          // Reset position when zooming out
          setPosition({ x: 0, y: 0 });
        }
        setLastTap(null);
      } else {
        // Start panning if zoomed in
        if (scale > 1) {
          setIsPanning(true);
          setLastPosition({
            x: event.nativeEvent.touches[0].pageX - position.x,
            y: event.nativeEvent.touches[0].pageY - position.y
          });
        }
        setLastTap(now);
      }
    } 
    // Pinch to zoom detection
    else if (event.nativeEvent.touches.length === 2) {
      const distance = getDistance(event.nativeEvent.touches);
      setInitialDistance(distance);
      setInitialScale(scale);
      setIsPanning(false);

      // Calculate and store the midpoint between fingers
      const midpoint = getMidpoint(event.nativeEvent.touches);
      setPinchMidpoint(midpoint);
      setLastPinchMidpoint(midpoint);
    }
  };

  // Update handleTouchMove function to apply constraints immediately
  const handleTouchMove = (event: GestureResponderEvent) => {
    // Handle panning when zoomed in
    if (isPanning && event.nativeEvent.touches.length === 1 && scale > 1) {
      const touch = event.nativeEvent.touches[0];
      const newPosition = {
        x: touch.pageX - lastPosition.x,
        y: touch.pageY - lastPosition.y
      };

      // Apply constraints immediately
      setPosition(constrainPosition(newPosition, scale));
    }
    // Pinch to zoom
    else if (event.nativeEvent.touches.length === 2 && initialDistance !== null) {
      const distance = getDistance(event.nativeEvent.touches);
      const newScale = initialScale * (distance / initialDistance);
      const boundedScale = Math.max(1, Math.min(newScale, 5));

      // Calculate new midpoint
      const midpoint = getMidpoint(event.nativeEvent.touches);

      // Calculate position adjustment to keep zoom centered on pinch point
      if (boundedScale !== scale) {
        // Calculate how much the midpoint moved
        const midpointDeltaX = midpoint.x - lastPinchMidpoint.x;
        const midpointDeltaY = midpoint.y - lastPinchMidpoint.y;

        // Calculate position adjustment based on scale change and midpoint
        const scaleChange = boundedScale / scale;
        const adjustedPosition = {
          x: position.x + midpointDeltaX + (midpoint.x - width/2) * (1 - scaleChange),
          y: position.y + midpointDeltaY + (midpoint.y - height/2) * (1 - scaleChange)
        };

        // Apply constrained position
        setPosition(constrainPosition(adjustedPosition, boundedScale));
        setScale(boundedScale);
      }

      setLastPinchMidpoint(midpoint);
    }
  };

  const handleTouchEnd = () => {
    setInitialDistance(null);
    setIsPanning(false);

    // Reset position if scale is back to 1
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    } else {
      // Ensure position is constrained
      setPosition(constrainPosition(position, scale));
    }
  };

  return (
    <View style={styles.container}>
      <View 
        style={styles.imageContainer}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          source={{ uri: finalUri }}
          style={[
            styles.image, 
            { 
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { scale }
              ] 
            }
          ]}
          onError={(error) => console.log("Image loading error:", error.nativeEvent.error, "URL:", finalUri)}
        />
      </View>
      
      {/* Back button */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: width,
    height: height,
    resizeMode: "contain",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default index;
