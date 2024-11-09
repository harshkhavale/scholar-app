import { HelloWave } from "@/components/HelloWave";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View, FlatList } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import Constants from "expo-constants";
import { useQuery } from "@tanstack/react-query";
import CourseItem from "@/components/CourseItem";
interface Topic {
  id: string;
  name: string;
  icon: string;
}

interface Course {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  topics: Topic[];
  price: string;
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
    const response = await axios.get(`https://scholar-server-3dv6.onrender.com/api/courses`
    //   , {
    //   params: { search: searchTerm },
    //   headers: {
    //     Authorization: `Bearer ${Constants.extra?.token}`,
    //   },
    // }
  );
    // Transform the response data to match the Course interface
    return response.data.map((course: any) => ({
      id: course._id, // Map _id to id
      title: course.title,
      thumbnail: course.thumbnail,
      description: course.description,
      topics: course.topics.map((topicId: string) => {
        return topics.find((topic) => topic.id === topicId) || {
          id: topicId,
          name: topicId,
          icon: "default-icon", // Fallback icon if topic is not found
        };
      }),
      price: course.price || "Free", // Set default value if price is missing
    }));
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

export default function HomeScreen() {
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
              Jayraj Jadhav
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
      </ScrollView>
     {/* #categories-courses */}
     {
  isLoading ? (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  ) : error ? (
    <Text>Error: {(error as Error).message}</Text>
  ) : data ? (
    <FlatList
      horizontal
      data={data}
      renderItem={({ item }) => (
        <CourseItem course={item} customStyle="w-[22rem] pl-6" index={1}/>
      )}
      keyExtractor={(item) => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingLeft: 24 }} // Adjust padding if needed
    />
  ) : (
    <View className="flex-1 justify-center items-center">
      <Text>No results. Try searching for a different course.</Text>
    </View>
  )
}

    </View>
  );
}
