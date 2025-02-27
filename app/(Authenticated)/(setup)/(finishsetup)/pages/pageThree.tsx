import { uploadCover } from "@/app/Firebase/Services/StorageService";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { styles } from "../styles/styles";

const DEFAULT_COVER = "https://example.com/default-cover.png"; // Replace with actual default cover URL
interface PageProps {
  onValidation: (isValid: boolean) => void;
}

const PageThree: React.FC<
  PageProps & { formData: any; updateFormData: any }
> = ({ formData, updateFormData, onValidation }) => {
  const [cover, setCover] = useState<string>(
    formData.coverUrl || DEFAULT_COVER
  );

  // Open Image Picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Aspect ratio for cover images
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const uploadedCover = (await uploadCover(imageUri)) || DEFAULT_COVER; // Upload to Firebase Storage
      updateFormData("coverUrl", uploadedCover);
      setCover(uploadedCover);
    }
  };

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Text style={styles.subtext}>Upload Cover</Text>
      {/* Cover Upload Button */}
      <TouchableOpacity
        onPress={pickImage}
        style={{ position: "relative", marginVertical: 25 }}
      >
        <Image
          source={cover ? { uri: cover } : { uri: DEFAULT_COVER }}
          style={{
            width: 250,
            height: 150,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: "#ccc",
          }}
        />
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
