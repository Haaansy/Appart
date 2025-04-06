import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import Review from "@/app/types/Review";
import { fetchUserDataFromFirestore } from "@/app/Firebase/Services/DatabaseService";
import UserData from "@/app/types/UserData";
import Colors from "@/assets/styles/colors";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReviewerUserData = async () => {
      const userData = await fetchUserDataFromFirestore(review.userId);
      if (userData) {
        setUserData(userData);
        setLoading(false);
        console.log("User data:", userData);
      } else {
        setLoading(false);
        console.error("User data not found");
      }
    };

    fetchReviewerUserData();
  }, [review]);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={Colors.primary}
          style={{ marginBottom: 10 }}
        />
      )}
      {!loading && !userData && (
        <Text style={{ color: Colors.secondaryText }}>User not found</Text>
      )}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image source={{ uri: userData?.photoUrl }} style={styles.avatar} />
        <View>
          <Text
            style={{
              color: Colors.primaryText,
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {userData?.firstName} {userData?.lastName}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Ionicons
                key={star}
                name={star <= review.rating ? "star" : "star-outline"}
                size={16}
                color={Colors.primary}
                style={{ marginRight: 2 }}
              />
            ))}
          </View>
          {review.feedback && (
            <Text
              style={{
                color: Colors.secondaryText,
                fontSize: 14,
                marginTop: 4,
              }}
            >
              {review.feedback}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.secondaryBackground,
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default ReviewCard;
