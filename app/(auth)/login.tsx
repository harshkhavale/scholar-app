import { View, Text, Image, TextInput, Pressable } from "react-native";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import Button from "@/components/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from '@expo/vector-icons/AntDesign';
const Login = () => {
  return (
    <View className="gap-4 flex-1 w-full justify-center items-center happy">
      <Animated.View
        entering={FadeInDown.duration(300).delay(200).springify()}
        className="w-full"
      >
        <Text
          style={{ fontFamily: "Font" }}
          className="text-5xl text-orange-700 ps-4 leading-[3.5rem]"
        >
          Welcome, Resume your learnings!: Login
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.duration(300).delay(400).springify()}
        className="w-full p-4"
      >
        <View className="flex-col gap-4 items-center rounded-2xl p-4 mt-4">
          <TextInput
            style={{ fontFamily: "Font" }}
            placeholder="johndoe@gmail.com"
            className=" border-2 w-full rounded-2xl p-4"
          />

          <TextInput
            style={{ fontFamily: "Font" }}
            placeholder="Password@123"
            className=" border-2 w-full rounded-2xl p-4"
          />
        </View>
        <View className="flex-row gap-2 justify-center">
            <Pressable onPress={() => router.push("/")} className="flex-row items-center justify-center gap-2 border-2 px-4">
            <AntDesign name="google" size={30} color="gray" />
              <Text style={{ fontFamily: "Font" }} className="text-center leading-[3.5rem]">

                Google
              </Text>
            </Pressable>
            <Pressable onPress={() => router.push("/")} className="flex-row items-center justify-center gap-2 border-2 px-4">
            <AntDesign name="github" size={30} color="gray" />
             <Text style={{ fontFamily: "Font" }} className="text-center leading-[3.5rem]">
                GitHub
              </Text>
            </Pressable>
        </View>
        <Text
          style={{ fontFamily: "Font" }}
          className="text-center leading-[3.5rem] flex justify-center items-center"
        >
          Dont have any account?
          <Pressable onPress={() => router.push("/(auth)/register")}>
            <Text style={{ fontFamily: "Font" }} className="text-orange-700">
              Register
            </Text>
          </Pressable>
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.duration(300).delay(600).springify()}
        className="w-full flex justify-center items-center"
      >
        <Button title="Login" action={() => router.push("/(tabs)")} />
      </Animated.View>
    </View>
  );
};

export default Login;
