import { HelloWave } from "@/components/HelloWave";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: "business", name: "Business", icon: "briefcase" },
  { id: "tech", name: "Tech", icon: "hardware-chip" },
  { id: "design", name: "Design", icon: "color-palette" },
  { id: "marketing", name: "Marketing", icon: "megaphone" },
  { id: "health", name: "Health", icon: "fitness" },
  { id: "music", name: "Music", icon: "musical-notes" },
  { id: "lifestyle", name: "Lifestyle", icon: "heart" },
];

export default function HomeScreen() {
  const [selectedCategory, setSelectedCategory] = useState("business");

  const renderCategory = (item: Category) => {
    return (
      <Pressable
        key={item.id}
        onPress={() => {
          setSelectedCategory(item.id);
        }}
        className="mr-4 p-2 rounded-full items-center flex-col gap-4"
      >
        <View
          className={`p-4 rounded-full flex-row items-center ${
            selectedCategory === item.id
              ? "border-2 border-orange-700"
              : "border border-gray-400"
          }`}
        >
          <Ionicons
            name={item.icon as any}
            size={24}
            color={selectedCategory === item.id ? "#FF8C00" : "gray"}
          />
        </View>
        <Text style={{ fontFamily: "Font" }}>{item.name}</Text>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-white">
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
              Marrison Kalao
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
          {categories.map((item) => renderCategory(item))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}
