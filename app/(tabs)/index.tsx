import { HelloWave } from "@/components/HelloWave";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  FlatList,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import Constants from "expo-constants";
import { useQuery } from "@tanstack/react-query";
import CourseItem from "@/components/CourseItem";
import { Course } from "@/types/types";
import { useAuthStore } from "@/store/auth-store";

interface Topic {
  id: string;
  name: string;
  icon: string;
}

const topics: Topic[] = [
  { id: "business", name: "Business", icon: "briefcase" },
  { id: "tech", name: "Tech", icon: "hardware-chip" },
  { id: "design", name: "Design", icon: "color-palette" },
  { id: "marketing", name: "Marketing", icon: "megaphone" },
  { id: "health", name: "Health", icon: "fitness" },
  { id: "music", name: "Music", icon: "musical-notes" },
  { id: "lifestyle", name: "Lifestyle", icon: "heart" },
];
const fetchCourses = async (searchTerm?: string): Promise<Course[]> => {
  try {
    const response = await axios.get(
      `http://192.168.0.104:5000/api/courses`
      //   , {
      //   params: { search: searchTerm },
      //   headers: {
      //     Authorization: `Bearer ${Constants.extra?.token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
const fetchRecommendedCourses = async (): Promise<Course[]> => {
  try {
    const response = await axios.get(
      `http://192.168.0.104:5000/api/courses`
      //   , {
      //   params: { search: searchTerm },
      //   headers: {
      //     Authorization: `Bearer ${Constants.extra?.token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export default function HomeScreen() {
  const user = useAuthStore((state) => state.user);

  const [selectedTopic, setSelectedTopic] = useState("business");
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["search-courses", selectedTopic],
    queryFn: () => fetchCourses(selectedTopic),
    enabled: true,
  });
  const {
    data: recommendedcourses,
    error: recommendedcourseserror,
    isLoading: recommendedcoursesloading,
    refetch: recommendedcoursesrefetch,
  } = useQuery({
    queryKey: ["recommendedcourses"],
    queryFn: () => fetchRecommendedCourses(),
    enabled: true,
  });
  const renderTopic = (item: Topic) => {
    return (
      <Pressable
        key={item.id}
        onPress={() => {
          setSelectedTopic(item.id);
        }}
        className="mr-4 p-2 rounded-full items-center flex-col gap-4"
      >
        <View
          className={`p-4 rounded-full flex-row items-center ${
            selectedTopic === item.id
              ? "border-2 border-orange-700"
              : "border border-gray-400"
          }`}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={selectedTopic === item.id ? "#FF8C00" : "gray"}
          />
        </View>
        <Text style={{ fontFamily: "Font" }}>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* #topbar-orange */}
      <View className="pt-16 pb-6 px-6 bg-orange-700 text-white">
        <Animated.View className="flex-row justify-between items-center">
          <View>
            <View className="flex-row items-end gap-2">
              <Text
                style={{ fontFamily: "Font" }}
                className="text-white text-lg"
              >
                Good Morning
              </Text>
              <View>
                <HelloWave />
              </View>
            </View>
            <Text
              className="text-white text-2xl"
              style={{ fontFamily: "Font" }}
            >
             {user?.fullName}
            </Text>
          </View>
          <View>
            <MaterialCommunityIcons
              name="bell-badge-outline"
              size={30}
              color="white"
            />
          </View>
        </Animated.View>
        <Pressable onPress={() => router.push("/explore")}>
          <View className="flex-row items-center bg-white/20 rounded-2xl p-4 mt-4">
            <MaterialCommunityIcons name="magnify" size={20} color={"white"} />
            <Text style={{ fontFamily: "Font" }} className="text-white ml-2">
              What do you want to learn?
            </Text>
          </View>
        </Pressable>
      </View>
      {/* #topic-scroll */}
      <ScrollView className="flex-1 bg-white gap-4">
        <Animated.View
          className="gap-6"
          entering={FadeInDown.duration(500).delay(200).springify()}
        >
          <View className="flex-row justify-between px-6 py-4 items-center">
            <Text className="text-base" style={{ fontFamily: "Font" }}>
              Explore Topics
            </Text>
            <Text className="text-orange-700" style={{ fontFamily: "Font" }}>
              See more
            </Text>
          </View>
        </Animated.View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4 pl-4"
        >
          {topics.map((item) => renderTopic(item))}
        </ScrollView>

        {/* #categories-courses */}
        {isLoading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#FF8C00" />
          </View>
        ) : error ? (
          <Text>Error: {(error as Error).message}</Text>
        ) : data ? (
          <FlatList
            horizontal
            data={data}
            renderItem={({ item }) => (
              <CourseItem
                course={item}
                customStyle="w-[22rem] pl-6"
                index={1}
              />
            )}
            keyExtractor={(item) => item._id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 24 }} // Adjust padding if needed
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text style={{ fontFamily: "Font" }}>
              No results. Try searching for a different course.
            </Text>
          </View>
        )}
        {/* recommended-courses */}
        <View className="pt-6">
          <View className="flex-row justify-between px-6 py-4 items-center">
            <Text
              className="text-base font-semibold"
              style={{ fontFamily: "Font" }}
            >
              Recommended Courses
            </Text>
            <Text className="text-orange-700" style={{ fontFamily: "Font" }}>
              See more
            </Text>
          </View>

          {recommendedcoursesloading ? (
            <View className="flex-1 justify-center items-center pt-8">
              <ActivityIndicator size="large" color="#FF8C00" />
            </View>
          ) : recommendedcourseserror ? (
            <Text>Error: {(error as Error).message}</Text>
          ) : recommendedcourses ? (
            <FlatList
              horizontal
              data={recommendedcourses}
              renderItem={({ item }) => (
                <CourseItem
                  course={item}
                  customStyle="w-[22rem] pl-6"
                  index={1}
                />
              )}
              keyExtractor={(item) => item._id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 24 }} // Adjust padding if needed
            />
          ) : (
            <View className="flex-1 justify-center items-center">
              <Text style={{ fontFamily: "Font" }}>
                No results. Try searching for a different course.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
