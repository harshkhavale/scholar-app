import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { Educator } from "@/types/types";
import { BASE_URL } from "@/utils/endpoints";

export default function EducatorsScreen() {
  const [educators, setEducators] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredEducators, setFilteredEducators] = useState([]);

  // Fetch educators on component mount
  useEffect(() => {
    const fetchEducators = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/educators`);
        setEducators(response.data);
        setFilteredEducators(response.data);
      } catch (error) {
        console.error("Error fetching educators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEducators();
  }, []);

  // Filter educators based on search term
  useEffect(() => {
    const filtered = educators.filter(
      (educator:Educator) =>
        educator?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        educator?.specialties?.some((specialty:any) =>
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
    setFilteredEducators(filtered);
  }, [searchTerm, educators]);

  const renderEducatorItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      className="flex-1 m-2 bg-white rounded-xl shadow-md"
      onPress={() =>
        router.push({
          pathname: "/educator-detail",
          params: { educatorId: item._id },
        })
      }
    >
      {/* Background Image */}
      <View className="h-28 w-full rounded-t-xl overflow-hidden bg-gray-200">
        {item.background_image ? (
          <Image
            source={{ uri: `${BASE_URL}/uploads/educators/${item.background_image}` }}
            className="h-full w-full"
            resizeMode="cover"
            alt="@/assets/images/placeholder.png"
          />
        ) : (
          <Text className="text-gray-500 text-center pt-12">No Image</Text>
        )}
      </View>

      {/* Profile Image */}
      <Image
        source={
          item.profile_image
            ? { uri: `${BASE_URL}/uploads/educators/${item.profile_image}` }
            : require("@/assets/images/placeholder.png") // Fallback profile image
        }
        
        className="h-20 w-20 rounded-full object-cover border-2 border-gray-300 bg-white absolute top-16 left-4"
      />

      {/* Educator Info */}
      <View className="p-3 mt-4">
        <Text className="text-base font-semibold text-gray-800" numberOfLines={1}>
          {item.fullName}
        </Text>
        <Text className="text-sm text-gray-600" numberOfLines={2}>
          {item.description || "No description available"}
        </Text>
        {item.specialties.length > 0 && (
          <Text className="text-sm text-orange-500 mt-1">
            Specialties: {item.specialties.join(", ")}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100 mt-12">
      {/* Search Bar */}
      <View className="px-4 pb-8">
        <View className="flex-row items-center bg-white p-3 rounded-2xl shadow-md">
          <Ionicons name="search" size={20} color="#777" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search educators by name or specialty..."
            onChangeText={setSearchTerm}
            value={searchTerm}
          />
        </View>
      </View>

      {/* Educators Grid */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF8C00" />
        </View>
      ) : (
        <FlatList
          data={filteredEducators}
          renderItem={renderEducatorItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
