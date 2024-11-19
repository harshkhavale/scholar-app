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
import { Course } from "@/types/types";

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://192.168.0.104:5000/api/courses");
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search term
  useEffect(() => {
    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      className="flex-1 m-2 bg-white rounded-xl shadow-md"
      onPress={() => console.log("Course clicked:", item.title)}
    >
      {/* Course Image */}
      <Image
        source={{
          uri: `http://192.168.0.104:5000/uploads/thumbnails/${item?.thumbnail}`,
        }}
        className="h-32 w-full rounded-t-xl"
        resizeMode="cover"
      />

      {/* Course Info */}
      <View className="p-3">
        <Text
          className="text-base font-semibold text-gray-800 mb-2"
          numberOfLines={2}
        >
          {item.title}
        </Text>
        {/* Price and Rating */}
        <View className="flex-row items-center">
          <Text className="text-orange-500 text-sm font-bold">
            ${item.price || "Free"}
          </Text>
          <View className="flex-row items-center ml-3">
            <Ionicons name="star" size={16} color="#FFD700" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-100">
      {/* Search Bar */}
      <View className="flex-row items-center bg-white p-3 rounded-2xl mx-4 my-4 shadow-md">
        <Ionicons name="search" size={20} color="#777" />
        <TextInput
          className="flex-1 ml-2 text-base"
          placeholder="Search courses..."
          onChangeText={setSearchTerm}
          value={searchTerm}
        />
      </View>

      {/* Courses Grid */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF8C00" />
        </View>
      ) : (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseItem}
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
