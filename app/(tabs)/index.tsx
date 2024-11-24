import { HelloWave } from "@/components/HelloWave";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
  FlatList,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";

import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import Constants from "expo-constants";
import { useQuery } from "@tanstack/react-query";
import CourseItem from "@/components/CourseItem";
import { Course } from "@/types/types";
import { useAuthStore } from "@/store/auth-store";
import { add, add2 } from "@/assets";
import { BASE_URL } from "@/utils/endpoints";

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
      `${BASE_URL}/api/courses`
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
  const logout = useAuthStore((state) => state.clearAuth); // Add your logout function here

  const [showDropdown, setShowDropdown] = useState(false); // For the dropdown menu
  const [selectedTopic, setSelectedTopic] = useState("business");
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["search-courses", selectedTopic],
    queryFn: () => fetchCourses(selectedTopic),
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
              ? "border-2 border-orange-500"
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
  const getTimeBasedGreeting = () => {
    const currentHour = new Date().getHours();

    if (currentHour < 12) return "Good Morning";
    if (currentHour < 18) return "Good Afternoon";
    return "Good Evening";
  };
  const [greeting, setGreeting] = useState(getTimeBasedGreeting());
  return (
    <ScrollView className="flex-1 bg-white">
      {/* #topbar-orange */}
      <View className="pt-12 pb-6 px-6 bg-orange-500 text-white">
        <Animated.View className="flex-row justify-between items-center">
          <View>
            <View className="flex-row items-end gap-2">
              <Text
                style={{ fontFamily: "Font" }}
                className="text-white text-lg"
              >
                {greeting}
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
            <View>
              {/* Dropdown Trigger */}
              <Pressable onPress={() => setShowDropdown(!showDropdown)}>
                <Ionicons name="menu-sharp" size={30} color="white" />
              </Pressable>

              {/* Dropdown Menu */}
              {showDropdown && (
                <TouchableWithoutFeedback
                  onPress={() => setShowDropdown(false)}
                >
                  <View className="absolute w-40 right-0 mt-2 bg-white rounded-md shadow-lg z-10">
                    <Pressable
                      onPress={() => {
                        setShowDropdown(false);
                        logout(); // Call your logout function
                        router.push("/(auth)/login"); // Redirect to login screen
                      }}
                      className="p-4"
                    >
                      <Text
                        className="text-gray-700"
                        style={{ fontFamily: "Font" }}
                      >
                        Logout
                      </Text>
                    </Pressable>
                  </View>
                </TouchableWithoutFeedback>
              )}
            </View>
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
        <Image source={add} className=" h-60 w-full" />
        <Animated.View
          className="gap-6"
          entering={FadeInDown.duration(500).delay(200).springify()}
        >
          <View className="flex-row justify-between px-6 py-4 items-center">
            <Text className="text-2xl" style={{ fontFamily: "Font" }}>
              Explore Topics
            </Text>
            <Text className="text-orange-500" style={{ fontFamily: "Font" }}>
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
      </ScrollView>

      <Image source={add2} className=" w-[28rem] h-[32rem] mt-8" />
    </ScrollView>
  );
}
