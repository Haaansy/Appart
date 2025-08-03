import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import CustomInputWithButton from "@/app/components/CustomInputButton";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import UserData from "@/app/types/UserData";
import { fetchTenantByDisplayName } from "@/app/Firebase/Services/DatabaseService";
import { Ionicons } from "@expo/vector-icons";
import ApartmentComponent from "./components/ApartmentComponent";

interface ExistingAccountFormProps {
  type: string;
  property: any;
}

const ExistingAccountForm = ({ type, property }: ExistingAccountFormProps) => {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [accounts, setAccounts] = React.useState<UserData[] | []>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSearch = async () => {
    setSearchQuery("");

    const fetchedAccounts = await fetchTenantByDisplayName(searchQuery.trim());

    if (fetchedAccounts) {
      setAccounts(
        Array.isArray(fetchedAccounts) ? fetchedAccounts : [fetchedAccounts]
      );
    } else {
      setAccounts([]);
      setError("No accounts found");
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <CustomInputWithButton
        onButtonPress={handleSearch}
        iconName="search"
        label="Enter Username"
        onChangeText={(value) => {
          setSearchQuery(value);
        }}
        value={searchQuery}
        disabled={accounts.length > 0}
      />
      <FlatList
        data={accounts as []}
        scrollEnabled={false}
        renderItem={({ item }: { item: UserData }) => (
          <View
            style={{
              padding: 10,
              borderBottomWidth: 1,
              borderColor: "#ccc",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>{item.displayName}</Text>
            <TouchableOpacity
              onPress={() => {
                setAccounts((prev) =>
                  prev.filter((account) => account.id !== item.id)
                );
              }}
            >
              <Ionicons name="trash-bin" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {error && (
        <Text style={{ color: "red", margin: 10, alignSelf: "center" }}>
          {error}
        </Text>
      )}

      {accounts.length > 0 && (
        <View style={{ marginTop: 20, paddingBottom: 350 }}>
          <ApartmentComponent
            apartment={property}
            tenantId={accounts[0].id as string}
          />
        </View>
      )}
    </ScrollView>
  );
};

export default ExistingAccountForm;
