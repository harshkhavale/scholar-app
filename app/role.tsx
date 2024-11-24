import { View, Text, Pressable, ScrollView, Image } from "react-native";
import React from "react";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";
import { ExpoRouter, router } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { schoolgirl, teacher } from "@/assets";
export interface RoleCard {
  id: string; // Unique identifier for the role
  name: string; // Display name of the role
  value: string;
  description: string; // Description of the role
  image: Object; // Path or URL of the image
  path: any; // Navigation path
}

export const roles: RoleCard[] = [
  {
    id: "educator",
    name: "Educator",
    value: "educator",
    description: "Teach courses, create content, and engage with students.",
    image: teacher,
    path: "/(auth)", // Ensure this matches a valid file in your app's structure
  },
  {
    id: "learner",
    name: "Student",
    value: "student",
    description:
      "Take courses, interact with instructors, and enhance your skills.",
    image: schoolgirl,
    path: "/(auth)/register", // Ensure this matches a valid file in your app's structure
  },
];

const RoleSelectionScreen = () => {
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        paddingVertical: 20,
      }}
    >
      <Animated.View
        entering={FadeInDown.duration(300).delay(200).springify()}
        className="w-full px-6 mb-8"
      >
        <Text
          style={{ fontFamily: "Font" }}
          className="text-4xl text-center mt-8 leading-[3.5rem]"
        >
          Select Your Role
        </Text>
      </Animated.View>

      {roles.map((role, index) => (
        <Animated.View
          key={role.id}
          entering={FadeInLeft.duration(300)
            .delay(400 + index * 200)
            .springify()}
          className="w-11/12 mb-6 p-6 rounded-2xl bg-white border border-gray-300 shadow-md"
        >
          <View className="flex-row items-center mb-4">
            <Image source={role.image} className=" h-40 w-40 object-contain" />
            <Text
              style={{ fontFamily: "Font" }}
              className="ml-10 text-3xl text-center text-orange-500"
            >
              {role.name}
            </Text>
          </View>
          <Text
            style={{ fontFamily: "Font" }}
            className="text-center text-gray-500 mb-4"
          >
            {role.description}
          </Text>
          <Pressable
            onPress={() =>
              router.push({
                pathname: role.path,
                params: { userType: role.value },
              })
            }
            className="mt-4 bg-orange-500 py-3 rounded-2xl"
          >
            <Text
              style={{ fontFamily: "Font" }}
              className="text-center text-white font-semibold text-lg"
            >
              Choose {role.name}
            </Text>
          </Pressable>
        </Animated.View>
      ))}
      <View className=" flex-row items-center justify-center gap-2">
        <Text> Already have an account?</Text>
        <Pressable onPress={() => router.push("/(auth)/login")}>
          <Text
            style={{ fontFamily: "Font" }}
            className="text-orange-500 text-lg"
          >
            Login
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default RoleSelectionScreen;
