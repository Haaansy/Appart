import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TextInput,
  Switch,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import Colors from "@/assets/styles/colors";
import IconButton from "@/app/components/IconButton";
import CustomTextInput from "@/app/components/CustomTextInput";
import CustomTextArea from "@/app/components/CustomTextArea";
import CustomInputWithButton from "@/app/components/CustomInputButton";
import CustomBadge from "@/app/components/CustomBadge";
import CustomCounter from "@/app/components/CustomCounter";

const { width } = Dimensions.get("window");

const formatNumberWithCommas = (value: number) => {
  const numericValue = value.toString().replace(/[^0-9]/g, ""); // Remove non-numeric characters
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ","); // Add commas
};

interface PageProps {
  onValidation: (isValid: boolean) => void;
  formData: any;
  updateFormData: (key: string, value: any) => void;
  inputRefs: React.MutableRefObject<{ [key: string]: TextInput | null }>;
  onInputFocus: (key: string) => void;
}

const PageOne: React.FC<PageProps> = ({
  onValidation,
  formData,
  updateFormData,
  inputRefs,
  onInputFocus,
}) => {
  const flatListRef = useRef<FlatList<string> | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>(formData.tags || []);
  const [tagInput, setTagInput] = useState<string>("");

  const title = formData.title || "";
  const description = formData.description || "";
  const price = formData.price;
  const securityDeposit = formData.securityDeposit;
  const area = formData.area;
  const electricIncluded = formData.electricIncluded || false;
  const waterIncluded = formData.waterIncluded || false;
  const internetIncluded = formData.internetIncluded || false;

  useEffect(() => {
    const isValid =
      (imageList?.length ?? 0) > 0 && // Ensure imageList exists and has items
      (title?.trim()?.length ?? 0) > 0 && // Ensure title is a non-empty string
      (description?.trim()?.length ?? 0) > 0 && // Ensure description is a non-empty string
      (price ?? 0) > 0 && // Ensure price is a positive number
      (area ?? 0) > 0; // Ensure area is a positive number

    onValidation(isValid);
  }, [imageList, title, description, price, area, onValidation]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const storedImages = await AsyncStorage.getItem("uploadedImages");
        if (storedImages) {
          setImageList(JSON.parse(storedImages));
        }
      } catch (error) {
        console.error("Error loading images from storage:", error);
      }
    };
    loadImages();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Required", "You need to allow access to photos.");
      return;
    }

    if (imageList.length >= 20) {
      alert("You can only add up to 20 images.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      allowsEditing: false,
      quality: 1,
      selectionLimit: 20 - imageList.length, // limit to remaining slots
    });

    if (!result.canceled) {
      // result.assets is an array of selected images
      const selectedUris = result.assets.map((asset) => asset.uri);
      // Only add up to 20 images in total
      const remainingSlots = 20 - imageList.length;
      const imagesToAdd = selectedUris.slice(0, remainingSlots);
      const newImageList = [...imageList, ...imagesToAdd];
      setImageList(newImageList);
      await AsyncStorage.setItem(
        "uploadedImages",
        JSON.stringify(newImageList)
      );
      updateFormData("images", newImageList);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tagsList.includes(tagInput.trim())) {
      const newTagsList = [...tagsList, tagInput.trim()];
      setTagsList(newTagsList);
      updateFormData("tags", newTagsList);

      // Ensure state updates are applied correctly
      setTimeout(() => setTagInput(""), 0);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTagsList = tagsList.filter((tag) => tag !== tagToRemove);
    setTagsList(newTagsList);
    updateFormData("tags", newTagsList);
  };

  return (
    <>
      <Text style={{ fontSize: 25, fontWeight: "bold" }}>
        Basic Information
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          marginBottom: 15,
        }}
      >
        <Text
          style={{
            fontSize: 15,
            fontWeight: "semibold",
            color: Colors.secondaryText,
          }}
        >
          Add Images
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "semibold",
            color: Colors.secondaryText,
            marginLeft: 5,
          }}
        >
          ( you can add up to 20 images )
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontWeight: "bold",
            color: Colors.primaryText,
            marginLeft: 10,
          }}
        >
          {imageList.length} / 20
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        {imageList.length < 20 && (
          <IconButton
            icon="camera"
            onPress={pickImage}
            style={{
              width: 150,
              height: 150,
              backgroundColor: "#ddd",
              borderRadius: 10,
            }}
          />
        )}
        <FlatList
          ref={flatListRef}
          data={imageList}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => item + index}
          renderItem={({ item }) => (
            <Image
              source={{ uri: item }}
              style={{
                width: 150,
                height: 150,
                marginHorizontal: 10,
                borderRadius: 10,
              }}
            />
          )}
          snapToInterval={width * 0.9}
          decelerationRate="fast"
        />
      </View>
      <View style={{ marginTop: 25, marginBottom: 15 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "semibold",
            color: Colors.secondaryText,
          }}
        >
          Title
        </Text>
        <CustomTextInput
          onChangeText={(value) => updateFormData("title", value)}
          label={"Title"}
          value={title}
          returnKeyType="next"
        />
      </View>
      <View style={{ marginTop: 25, marginBottom: 15 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "semibold",
            color: Colors.secondaryText,
          }}
        >
          Description
        </Text>
        <CustomTextArea
          onChangeText={(value) => updateFormData("description", value)}
          value={description}
          ref={(ref) => (inputRefs.current["description"] = ref)}
          onFocus={() => onInputFocus("description")}
          returnKeyType="next"
          maxCharacters={1000}
        />
      </View>
      <View style={{ marginTop: 25, marginBottom: 15 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "semibold",
            color: Colors.secondaryText,
          }}
        >
          Tags
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "semibold",
            color: Colors.secondaryText,
            marginLeft: 5,
          }}
        >
          Add descriptive tags to help users find your apartment easily.
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <CustomInputWithButton
            buttonTitle={"+"}
            value={tagInput}
            onChangeText={setTagInput}
            onButtonPress={handleAddTag}
          />
        </View>
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
          {tagsList.map((tag, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.primaryBackground,
                paddingHorizontal: 3,
                paddingVertical: 5,
                borderRadius: 15,
              }}
            >
              <CustomBadge
                title={tag}
                icon="close"
                onPress={() => handleRemoveTag(tag)}
                style={{ backgroundColor: Colors.primary, margin: 5 }}
              />
            </View>
          ))}
        </View>
        <View style={{ marginVertical: 25 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "semibold",
              color: Colors.secondaryText,
            }}
          >
            Pricing
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "semibold",
              color: Colors.secondaryText,
              marginLeft: 5,
            }}
          >
            Set a fair and competitive price for your apartment. Specify the
            cost per month and deposit per contract.
          </Text>
          <CustomTextInput
            onChangeText={(value) =>
              updateFormData("price", Number(value.replace(/[^0-9]/g, "")))
            }
            label={"Price"}
            value={formatNumberWithCommas(price)}
            keyboardType="numeric"
            returnKeyType="next"
            textEnd="/mo"
            textStart="₱"
          />
          <CustomTextInput
            onChangeText={(value) =>
              updateFormData(
                "securityDeposit",
                Number(value.replace(/[^0-9]/g, ""))
              )
            }
            label={"Security Deposit"}
            value={formatNumberWithCommas(securityDeposit)}
            keyboardType="numeric"
            returnKeyType="next"
            textEnd="/contract"
            textStart="₱"
            status="optional"
          />
        </View>
        <View style={{ marginVertical: 25 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "semibold",
              color: Colors.secondaryText,
            }}
          >
            Rooms
          </Text>
          <Text
            style={{
              fontSize: 10,
              fontWeight: "semibold",
              color: Colors.secondaryText,
              marginLeft: 5,
            }}
          >
            Indicate the number and type of rooms in your apartment.
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20 }}> Bed Room </Text>
              <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
                {" "}
                Number of Bedrooms{" "}
              </Text>
            </View>
            <CustomCounter
              onChange={(value) => updateFormData("bedRooms", value)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20 }}> Bath Room </Text>
              <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
                {" "}
                Number of Bathrooms{" "}
              </Text>
            </View>
            <CustomCounter
              onChange={(value) => updateFormData("bathRooms", value)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20 }}> Living Room </Text>
              <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
                {" "}
                Number of Livingrooms{" "}
              </Text>
            </View>
            <CustomCounter
              onChange={(value) => updateFormData("livingRooms", value)}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginVertical: 10,
            }}
          >
            <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Text style={{ fontSize: 20 }}> Kitchen </Text>
              <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
                {" "}
                Number of Kitchen{" "}
              </Text>
            </View>
            <CustomCounter
              onChange={(value) => updateFormData("kitchen", value)}
            />
          </View>
        </View>
      </View>
      <View style={{ marginVertical: 25 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "semibold",
            color: Colors.secondaryText,
          }}
        >
          Tenant
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "semibold",
            color: Colors.secondaryText,
            marginLeft: 5,
          }}
        >
          Specify the maximum number of tenants your apartment can accommodate.
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 20 }}> Tenants </Text>
            <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
              {" "}
              Max number of tenants{" "}
            </Text>
          </View>
          <CustomCounter
            onChange={(value) => updateFormData("maxTenants", value)}
            initialValue={1}
            min={1}
          />
        </View>
      </View>
      <View style={{ marginVertical: 25 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "semibold",
            color: Colors.secondaryText,
          }}
        >
          Floor Details
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "semibold",
            color: Colors.secondaryText,
            marginLeft: 5,
          }}
        >
          Indicate the floor number and the total area of the apartment in
          square foot.
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 20 }}> Floor Levels </Text>
            <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
              {" "}
              Number of Floor Levels{" "}
            </Text>
          </View>
          <CustomCounter
            onChange={(value) => updateFormData("levels", value)}
            initialValue={1}
            min={1}
          />
        </View>
        <CustomTextInput
          label={"Floor Area"}
          keyboardType={"numeric"}
          textEnd="sq ft."
          value={formatNumberWithCommas(area)}
          onChangeText={(value) =>
            updateFormData("area", Number(value.replace(/[^0-9]/g, "")))
          }
        />
      </View>
      <View style={{ marginVertical: 25 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "semibold",
            color: Colors.secondaryText,
          }}
        >
          Parking
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "semibold",
            color: Colors.secondaryText,
            marginLeft: 5,
          }}
        >
          Specify the parking spaces included in the apartment.
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 20 }}> Parking Space </Text>
            <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
              {" "}
              Number of Parking Scapes{" "}
            </Text>
          </View>
          <CustomCounter
            onChange={(value) => updateFormData("levels", value)}
          />
        </View>
      </View>
      <View style={{ marginVertical: 25 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: "semibold",
            color: Colors.secondaryText,
          }}
        >
          Services
        </Text>
        <Text
          style={{
            fontSize: 10,
            fontWeight: "semibold",
            color: Colors.secondaryText,
            marginLeft: 5,
          }}
        >
          Specify any services included in the price.
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 20 }}> Electric Included </Text>
            <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
              {" "}
              Electric Service Included{" "}
            </Text>
          </View>
          <Switch
            value={electricIncluded}
            onValueChange={(value) => updateFormData("electricIncluded", value)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 20 }}> Water Service </Text>
            <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
              {" "}
              Water Service Included{" "}
            </Text>
          </View>
          <Switch
            value={waterIncluded}
            onValueChange={(value) => updateFormData("waterIncluded", value)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <View style={{ flexDirection: "column", alignItems: "flex-start" }}>
            <Text style={{ fontSize: 20 }}> Internet Service </Text>
            <Text style={{ fontSize: 12, color: Colors.secondaryText }}>
              {" "}
              Internet Service Included{" "}
            </Text>
          </View>
          <Switch
            value={internetIncluded}
            onValueChange={(value) => updateFormData("internetIncluded", value)}
          />
        </View>
      </View>
    </>
  );
};

export default PageOne;
