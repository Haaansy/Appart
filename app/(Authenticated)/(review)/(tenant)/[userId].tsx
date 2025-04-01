import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import Colors from "@/assets/styles/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import CustomTextArea from "@/app/components/CustomTextArea";
import {
  deleteAlert,
  fetchUserDataFromFirestore,
  updateUserData,
} from "@/app/Firebase/Services/DatabaseService";
import UserData from "@/app/types/UserData";
import { getStoredUserData } from "@/app/Firebase/Services/AuthService";
import { Timestamp } from "firebase/firestore";

const index = () => {
  const { userId, alertId } = useLocalSearchParams();
  const scrollViewRef = useRef<ScrollView>(null);
  const reviewSectionRef = useRef<View>(null);
  const { height } = Dimensions.get("window");
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [currentUserData, setCurrentUserData] = useState<UserData>(
    {} as UserData
  );
  const [tenantData, setTenantData] = useState<UserData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getStoredUserData();
      setCurrentUserData(userData);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchTenant = async () => {
      const tenantData = await fetchUserDataFromFirestore(String(userId));

      if (tenantData) {
        setTenantData(tenantData);
      } else {
        console.error("Tenant data not found");
      }
    };

    fetchTenant();
  }, [userId]);

  const scrollToReview = () => {
    scrollViewRef.current?.scrollTo({ y: height, animated: true });
  };

  const handleSubmitReview = async () => {
    try {
      setIsSubmitting(true);
      setErrorMsg("");

      if (rating === 0) {
        setErrorMsg("Please select a rating.");
        return;
      }

      await updateUserData(String(userId), {
        ...tenantData,
        reviews: [
          ...(tenantData?.reviews || []),
          {
            userId: currentUserData?.id as string,
            rating: rating,
            feedback: feedback,
            createdAt: Timestamp.now(),
          },
        ],
      });

      await deleteAlert(String(alertId));
      router.replace(`/(Authenticated)/(tabs)/Home`);
    } catch (error) {
      console.error("Error submitting review:", error);
      setErrorMsg("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StatusBar hidden={true} />
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
        snapToInterval={height}
        decelerationRate="fast"
      >
        {/* Main Content Section - Full Height */}
        <View style={[styles.fullScreenSection]}>
          <ImageBackground
            source={require("@/assets/images/Vectors/background.png")}
            style={styles.backgroundVector}
          />
          <View style={[styles.container]}>
            <View style={styles.topBar}>
              <Image
                source={require("@/assets/images/Icons/Dark-Icon.png")}
                style={styles.icon}
              />
            </View>
            <View style={styles.center}>
              <View style={styles.mainContent}>
                <Image
                  source={require("@/assets/images/AI-Character-V1/alert.png")}
                  style={styles.character}
                />
                <Text style={styles.text}> A Booking has completed </Text>
                <Text style={styles.subText}> Please rate your tenant. </Text>
              </View>
              <Pressable style={styles.bottomContent} onPress={scrollToReview}>
                <Ionicons name="arrow-down" size={24} color="black" />
                <Text style={styles.subText}> Scroll Down to Review </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Review Section - Full Height */}
        <View ref={reviewSectionRef} style={styles.reviewFullScreenSection}>
          <View style={styles.reviewSection}>
            <Text style={styles.reviewTitle}>Write Your Review</Text>

            <View style={styles.reviewContent}>
              {tenantData && (
                <Image
                  source={{ uri: tenantData?.photoUrl }}
                  style={styles.image}
                />
              )}
              <Text style={styles.reviewText}>
                How was your experience with {tenantData?.firstName} $
                {tenantData?.lastName}?
              </Text>

              <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setRating(star)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name="star"
                      size={40}
                      color={
                        star <= rating ? Colors.primary || "#0066cc" : "#DDDDDD"
                      }
                      style={styles.star}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {rating > 0 && (
                <Text style={styles.ratingText}>
                  {rating === 1
                    ? "Poor"
                    : rating === 2
                    ? "Fair"
                    : rating === 3
                    ? "Good"
                    : rating === 4
                    ? "Very Good"
                    : "Excellent"}
                </Text>
              )}

              <View style={styles.commentSection}>
                <CustomTextArea
                  label="Feedback(Optional)"
                  value={feedback}
                  onChangeText={(value) => {
                    setFeedback(value);
                  }}
                />
              </View>

              {errorMsg ? (
                <Text style={styles.errorText}>{errorMsg}</Text>
              ) : null}

              <TouchableOpacity
                style={[
                  styles.submitButton,
                  (rating === 0 || isSubmitting) && styles.disabledButton,
                ]}
                disabled={rating === 0 || isSubmitting}
                onPress={handleSubmitReview}
              >
                <Text style={styles.submitButtonText}>
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    // No flexGrow to prevent auto-centering
  },
  fullScreenSection: {
    height: Dimensions.get("window").height,
    position: "relative",
  },
  container: {
    flex: 1,
    paddingHorizontal: 25,
    minHeight: 500, // Ensure enough height for scrolling
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
  topBar: {
    flexDirection: "row",
    marginTop: 65,
    alignItems: "center",
  },
  center: {
    flex: 1,
    borderRadius: 15,
    padding: 20,
    justifyContent: "space-between",
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContent: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 10,
  },
  character: {
    width: "50%",
    height: "50%",
    resizeMode: "contain",
    marginBottom: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.primaryText,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: Colors.secondaryText,
    textAlign: "center",
    marginTop: 10,
  },
  reviewFullScreenSection: {
    minHeight: Dimensions.get("window").height,
    backgroundColor: Colors.primaryBackground,
  },
  reviewSection: {
    padding: 20,
    flex: 1,
    justifyContent: "center",
  },
  reviewHandle: {
    width: 50,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  reviewTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  reviewContent: {
    alignItems: "center",
  },
  reviewText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  starContainer: {
    flexDirection: "row",
    marginVertical: 20,
  },
  star: {
    marginHorizontal: 5,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: "500",
    color: Colors.primaryText,
    marginTop: 10,
  },
  commentSection: {
    width: "100%",
    marginTop: 20,
  },
  commentLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.secondaryText,
  },
  commentBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    width: "100%",
    height: 120,
    justifyContent: "flex-start",
  },
  placeholderText: {
    color: "#999",
  },
  submitButton: {
    backgroundColor: Colors.primary || "#0066cc",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    width: "100%",
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  image: {
    width: 200,
    height: 200,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 100,
    marginBottom: 20,
    resizeMode: "cover",
  },
  errorText: {
    color: "red",
    marginTop: 10,
    textAlign: "center",
  },
});

export default index;
