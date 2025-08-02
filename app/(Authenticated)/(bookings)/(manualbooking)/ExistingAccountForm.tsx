import { View, Text, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import CustomInputWithButton from "@/app/components/CustomInputButton";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import UserData from "@/app/types/UserData";
import { fetchTenantByDisplayName } from "@/app/Firebase/Services/DatabaseService";
import CustomButton from "@/app/components/CustomButton";
import { Ionicons } from "@expo/vector-icons";

const ExistingAccountForm = () => {
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

  const handleConfirm = () => {
    if (accounts.length === 0) {
      setError("Please select at least one account");
      return;
    }

    // Handle confirmation logic here
  }

  return (
    <View>
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
        renderItem={({ item }: { item: UserData }) => (
          <View
            style={{ padding: 10, borderBottomWidth: 1, borderColor: "#ccc", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}
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
        <Text style={{ color: "red", margin: 10, alignSelf: "center" }}>{error}</Text>
      )}

      <CustomButton
        title="Confirm"
        onPress={() => {
          // Handle account selection
        }}
        disabled={accounts.length === 0}
      />
    </View>
  );
};

export default ExistingAccountForm;
