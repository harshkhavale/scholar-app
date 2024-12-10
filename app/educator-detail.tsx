import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  FlatList,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Course, Educator } from "@/types/types";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "@/utils/endpoints";
import { user } from "@/assets";
import CourseItem from "@/components/CourseItem";

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
  const { data, error, isLoading, refetch } = useQuery<Educator>({
    queryKey: ["educator-details", educatorId],
    queryFn: () => fetchEducatorDetail(),
    enabled: true,
  });
  const fetchEducatorCourses = async (): Promise<Course[]> => {
    try {
      const response = await axios.get<Course[]>(
        `${BASE_URL}/api/courses/educator/${data?._id}`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  };
  const {
    data: eduData,
    error: eduError,
    isLoading: eduIsLoading,
    refetch: eduRefetch,
  } = useQuery<Course[]>({
    queryKey: ["educator-courses", educatorId],
    queryFn: () => fetchEducatorCourses(),
    enabled: !!data?._id, // Fetch only when educator details are available
  });

  const openLink = async (url: string) => {
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url);
    } else {
      alert("Invalid URL");
    }
  };

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      className="flex-1 m-[2px] bg-white rounded-xl shadow-md overflow-hidden"
      onPress={() =>
        router.push({
          pathname: "/course-detail",
          params: { courseId: item._id },
        })
      }
    >
      {/* Course Image with Gradient Overlay */}
      <View className="relative">
        <Image
          source={{
            uri: `${BASE_URL}/uploads/thumbnails/${item?.thumbnail}`,
          }}
          className="h-48 w-full object-cover"
          resizeMode="cover"
        />
        <View className="absolute bottom-0 left-0 right-0 bg-black/65 p-3">
          <Text
            className="text-white text-lg font-semibold"
            numberOfLines={2}
            style={{ fontFamily: "Font" }}
          >
            {item.title}
          </Text>
        </View>
      </View>

      {/* Course Info */}
      <View className="p-4">
        <View className="flex-row justify-between items-center">
          {/* Price */}
          <Text className="text-orange-500 text-lg font-bold">
            ${item.price || "Free"}
          </Text>

          {/* Rating */}
          <View className="flex-row items-center">
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text className="ml-1 text-sm text-gray-600">4.5</Text>
            {/* Update rating dynamically */}
          </View>
        </View>

        {/* Topics */}
        {item.topics && item.topics.length > 0 && (
          <View className="mt-2">
            <Text className="text-sm text-gray-500">Topics:</Text>
            <View className="flex-row flex-wrap gap-1 mt-1">
              {item.topics.slice(0, 3).map((topic, index) => (
                <Text
                  key={index}
                  className="text-xs bg-blue-600 text-white rounded-full p-1"
                >
                  {topic}
                </Text>
              ))}
              {item.topics.length > 3 && (
                <Text className="text-sm text-gray-500">
                  +{item.topics.length - 3} more
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
  return (
    <ScrollView className="flex-1 bg-gray-100 dark:bg-gray-900 ">
      {/* Background Image */}
      {data?.background_image && (
        <Image
          source={{
            uri: `${BASE_URL}/uploads/profiles/${data.background_image}`,
          }}
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
                ? `${BASE_URL}/uploads/profiles/${data.profile_image}`
                : "https://via.placeholder.com/150",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Name and Description */}
        <Text
          style={{ fontFamily: "Font" }}
          className="text-center text-xl font-semibold text-gray-800 dark:text-gray-100 mt-4"
        >
          {data?.fullName}
        </Text>
        <Text
          style={{ fontFamily: "Font" }}
          className="text-center text-gray-600 dark:text-gray-400 text-sm mt-2"
        >
          {data?.description || "No description available."}
        </Text>
      </View>

      {/* Specialties */}
      {data?.specialties && (
        <View className="px-4 mt-6">
          <Text
            style={{ fontFamily: "Font" }}
            className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2"
          >
            Specialties
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {data?.specialties.map((specialty, index) => (
              <Text
                style={{ fontFamily: "Font" }}
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
          <Text
            style={{ fontFamily: "Font" }}
            className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2"
          >
            Contact
          </Text>
          <TouchableOpacity
            onPress={() => openLink(`mailto:${data.contact_email}`)}
            className="flex-row items-center gap-2 bg-gray-200 dark:bg-gray-700 px-4 py-3 rounded-lg"
          >
            <Ionicons name="mail" size={20} color="#FF8C00" />
            <Text
              style={{ fontFamily: "Font" }}
              className="text-gray-700 dark:text-gray-300"
            >
              {data.contact_email}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Social Links */}
      {data?.social_links && (
        <View className="px-4 mt-6">
          <Text
            style={{ fontFamily: "Font" }}
            className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2"
          >
            Social Links
          </Text>
          <View className="flex-row gap-4">
            {data?.social_links.linkedin && (
              <TouchableOpacity
                onPress={() => openLink(data?.social_links?.linkedin || "/")}
              >
                <AntDesign name="linkedin-square" size={32} color="#0077b5" />
              </TouchableOpacity>
            )}
            {data.social_links.twitter && (
              <TouchableOpacity
                onPress={() => openLink(data?.social_links?.twitter || "/")}
              >
                <AntDesign name="twitter" size={32} color="#1DA1F2" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
      {/* Courses */}
      {eduIsLoading ? (
        <View className="flex-1 justify-center items-center mb-10">
          <ActivityIndicator size="large" color="#FF8C00" />
        </View>
      ) : eduData && eduData.length > 0 ? (
        <View className=" p-2">
          <Text
            style={{ fontFamily: "Font" }}
            className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2"
          >
            Educator Courses
          </Text>
          <FlatList
          data={eduData}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={{ paddingHorizontal: 8 }}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          showsVerticalScrollIndicator={false}
        />
        </View>
      
      ) : (
        <View className="flex-1 justify-center items-center">
          <Text>No courses available.</Text>
        </View>
      )}

      {/* Footer */}
      <View className="mt-8 mb-4 px-4">
        <Text
          style={{ fontFamily: "Font" }}
          className="text-center text-sm text-gray-600 dark:text-gray-400"
        >
          Profile last updated on{" "}
          {new Date(data?.updatedAt).toLocaleDateString()}
        </Text>
      </View>
    </ScrollView>
  );
};

export default EducatorDetails;
