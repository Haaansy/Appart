import { uploadAvatar } from "@/app/Firebase/Services/StorageService";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { View, TouchableOpacity, Text, Image } from "react-native";
import { styles } from "../styles/styles";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/assets/styles/colors";

interface PageProps {
  onValidation: (isValid: boolean) => void;
}

const PageTwo: React.FC<PageProps & { formData: any; updateFormData: any }> = ({
  onValidation,
  formData,
  updateFormData,
}) => {
  const [avatar, setAvatar] = useState<string>(
    formData.photoUrl
  );

  // Open Image Picker
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const uploadedAvatar = (await uploadAvatar(imageUri)); // Upload to Firebase Storage
      updateFormData("photoUrl", uploadedAvatar);
      setAvatar(uploadedAvatar as string);
    }
  };

  return (
    <View style={{ alignItems: "center", marginTop: 20 }}>
      <Text style={styles.subtext}>Upload Avatar</Text>
      {/* Avatar Upload Button */}
      <TouchableOpacity
        onPress={pickImage}
        style={{ position: "relative", marginVertical: 25 }}
      >
        <Image
          source={{ uri: avatar }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 2,
            borderColor: "gray",
          }}
        />
        {/* Upload Icon in Center */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: "#000",
            borderRadius: 20,
            padding: 5,
            width: 30,
          }}
        >
          <Ionicons name="camera" size={20} color={Colors.primaryBackground} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PageTwo;
