import { uploadCover } from "@/app/Firebase/Services/StorageService";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../styles/styles";
import Colors from "@/assets/styles/colors";

interface PageProps {
  onValidation: (isValid: boolean) => void;
}

const PageThree: React.FC<
  PageProps & { formData: any; updateFormData: any }
> = ({ formData, updateFormData, onValidation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [cover, setCover] = useState<string>(formData.coverUrl);

  // Open Image Picker
  const pickImage = async () => {
    setLoading(true);
    onValidation(false);

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9], // Aspect ratio for cover images
        quality: 1,
      });

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const uploadedCover = await uploadCover(imageUri);
        updateFormData("coverUrl", uploadedCover);
        setCover(uploadedCover as string);
        setLoading(false);
        onValidation(true);
      }
    } catch (error) {
      console.error("Error during image picking process:", error);
      Alert.alert("Error", "Failed to access photos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Text style={styles.subtext}>Upload Cover</Text>
      {/* Cover Upload Button */}
      <TouchableOpacity
        onPress={pickImage}
        style={{ position: "relative", marginVertical: 25 }}
        disabled={loading}
      >
        {loading === false && (
          <Image
            source={{ uri: cover }}
            style={{
              width: 250,
              height: 150,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "#ccc",
              backgroundColor: Colors.primaryBackground,
            }}
          />
        )}

        {loading && (
          <ActivityIndicator
            color={Colors.primary}
            style={{
              width: 250,
              height: 150,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: "#ccc",
              backgroundColor: Colors.primaryBackground,
            }}
          />
        )}

        {/* Upload Icon in Center */}
        <View
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            backgroundColor: "#000",
            borderRadius: 20,
            padding: 5,
          }}
        >
          <Ionicons name="camera" size={20} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PageThree;
