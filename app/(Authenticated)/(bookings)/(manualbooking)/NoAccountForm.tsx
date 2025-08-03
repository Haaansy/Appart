import { View, Text } from "react-native";
import React, { useState } from "react";
import CustomTextInput from "@/app/components/CustomTextInput";
import ApartmentComponent from "./components/ApartmentComponent";
import { ScrollView } from "react-native-gesture-handler";
import UserData from "@/app/types/UserData";

interface NoAccountFormProps {
  apartment: any;
}

const NoAccountForm = ({ apartment }: NoAccountFormProps) => {
  const [userData, setUserData] = useState<UserData>({
        firstName: "",
        lastName: "",
        emergencyContact: "",
        emergentContactNumber: "",
        phoneNumber: "",
        coverUrl: "",
        sex: "",
        role: "",
        email: "",
        id: "",
        displayName: "",
        photoUrl: "",
        isAdmin: false,
        reviews: [],
  });
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <CustomTextInput
        label={"First Name"}
        status="required"
        value={userData.firstName}
        onChangeText={(value) => {
          setUserData((prev) => ({ ...prev, firstName: value }));
        }}
      />
      <CustomTextInput
        label={"Last Name"}
        status="required"
        value={userData.lastName}
        onChangeText={(value) => {
          setUserData((prev) => ({ ...prev, lastName: value }));
        }}
      />
      <CustomTextInput
        label={"Contact Number"}
        status="required"
        value={userData.phoneNumber}
        onChangeText={(value) => {
          setUserData((prev) => ({ ...prev, phoneNumber: value }));
        }}
      />
      <CustomTextInput
        label={"Emergency Contact"}
        status="required"
        value={userData.emergencyContact}
        onChangeText={(value) => {
          setUserData((prev) => ({ ...prev, emergencyContact: value }));
        }}
      />
      <CustomTextInput
        label={"Emergency Contact Number"}
        status="required"
        value={userData.emergentContactNumber}
        onChangeText={(value) => {
          setUserData((prev) => ({ ...prev, emergentContactNumber: value }));
        }}
      />
      {userData.firstName &&
        userData.lastName &&
        userData.phoneNumber &&
        userData.emergencyContact &&
        userData.emergentContactNumber && (
          <View style={{ marginTop: 35, paddingBottom: 350 }}>
            <ApartmentComponent
              apartment={apartment}
              noaccountData={userData}
            />
          </View>
        )}
    </ScrollView>
  );
};

export default NoAccountForm;
