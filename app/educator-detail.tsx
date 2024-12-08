import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Linking } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Educator } from "@/types/types";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "@/utils/endpoints";
import { user } from "@/assets";


interface EducatorDetailsProps {
  educator: Educator;
}


const EducatorDetails: React.FC<EducatorDetailsProps> = () => {
    const { educatorId } = useLocalSearchParams();
    const fetchEducatorDetail = async (): Promise<Educator> => {
        try {
          const response = await axios.get<Educator>(
            `${BASE_URL}/api/educators/${educatorId}`
          );
          return response.data;
        } catch (error) {
          console.error("Error fetching courses:", error);
          throw error;
        }
      };
  const openLink = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      alert("Invalid URL");
    }
  };
  const { data, error, isLoading, refetch } = useQuery<Educator>({
    queryKey: ["educator-details", educatorId],
    queryFn: () => fetchEducatorDetail(),
    enabled: true,
  });
  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900 pt-20">
      {/* Background Image */}
      {data?.background_image && (
        <Image
          source={{ uri: `${BASE_URL}/uploads/educators/${data.background_image}` }}
          className="h-48 w-full"
          resizeMode="cover"
          alt={"@assets/user.png"}
        />
      )}

      {/* Profile Section */}
      <View className="px-4 -mt-16">
        {/* Profile Image */}
        <View className="self-center rounded-full overflow-hidden border-4 border-white dark:border-gray-800 w-32 h-32">
          <Image
            source={{
              uri: data?.profile_image
                ? `${BASE_URL}/uploads/educators/${data.profile_image}`
                : "https://via.placeholder.com/150",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Name and Description */}
        <Text className="text-center text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4">
          {data?.fullName}
        </Text>
        <Text className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2">
          {data?.description || "No description available."}
        </Text>
      </View>

      {/* Specialties */}
      {data?.specialties && (
        <View className="px-4 mt-6">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Specialties</Text>
          <View className="flex-row flex-wrap gap-2">
            {data?.specialties.map((specialty, index) => (
              <Text
                key={index}
                className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm shadow-md"
              >
                {specialty}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Contact Info */}
      {data?.contact_email && (
        <View className="px-4 mt-6">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Contact</Text>
          <TouchableOpacity
            onPress={() => openLink(`mailto:${data.contact_email}`)}
            className="flex-row items-center gap-2 bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-lg"
          >
            <Ionicons name="mail" size={20} color="#FF8C00" />
            <Text className="text-gray-700 dark:text-gray-300">{data.contact_email}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Social Links */}
      {data?.social_links && (
        <View className="px-4 mt-6">
          <Text className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Social Links</Text>
          <View className="flex-row gap-4">
            {data?.social_links.linkedin && (
              <TouchableOpacity onPress={() => openLink(data?.social_links?.linkedin || "/")}>
                <AntDesign name="linkedin-square" size={32} color="#0077b5" />
              </TouchableOpacity>
            )}
            {data.social_links.twitter && (
              <TouchableOpacity onPress={() => openLink(data?.social_links?.twitter || "/")}>
                <AntDesign name="twitter" size={32} color="#1DA1F2" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Footer */}
      <View className="mt-8 mb-4 px-4">
        <Text className="text-center text-sm text-gray-600 dark:text-gray-400">
          
          Profile last updated on {new Date(data?.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

export default EducatorDetails;
