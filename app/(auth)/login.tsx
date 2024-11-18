// components/Login.tsx
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import React, { useState } from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth-store"; // Import Zustand store
import Constants from 'expo-constants';
import AntDesign from "@expo/vector-icons/AntDesign";
import Button from "@/components/Button";
import axios from "axios";
import { AUTH, BASE_URL } from "@/utils/endpoints";
import { Auth } from "@/types/types";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogin = async () => {
    try {
      // Type the Axios response to ensure it matches `Auth`
      const response = await axios.post<Auth>("http://192.168.0.104:5000/api/auth/login", {
        email,
        password,
      });
  
      const data = response.data; // `data` is now strongly typed as `Auth`
  
      if (response.status === 200) {
        // On successful login, store token and user info in Zustand store
        setUser(data.user); // `data.user` is guaranteed to match the `User` structure
        setToken(data.token); // `data.token` is guaranteed to be a string
  
        // Redirect to /home on success
        router.push("/(tabs)");
      } else {
        Alert.alert("Login Failed", data.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.response?.data?.message || "Network error. Please try again.");
    }
  };

  return (
    <View className="gap-4 flex-1 w-full justify-center items-center">
      <Animated.View entering={FadeInDown.duration(300).delay(200).springify()} className="w-full">
        <Text style={{ fontFamily: "Font" }} className="text-5xl text-orange-700 ps-4 leading-[3.5rem]">
          Welcome, Resume your learnings!: Login
        </Text>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(300).delay(400).springify()} className="w-full p-4">
        <View className="flex-col gap-4 items-center rounded-2xl p-4 mt-4">
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={{ fontFamily: "Font" }}
            placeholder="johndoe@gmail.com"
            className="border-2 w-full rounded-2xl p-4"
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={{ fontFamily: "Font" }}
            placeholder="Password@123"
            className="border-2 w-full rounded-2xl p-4"
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
          Already have ab account?
          <Pressable onPress={() => router.push("/(auth)/login")}>
            <Text style={{ fontFamily: "Font" }} className="text-orange-700">
              Login
            </Text>
          </Pressable>
        </Text>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.duration(300).delay(600).springify()}
        className="w-full flex justify-center items-center"
      >
        <Button title="Login" action={handleLogin} />
      </Animated.View>
    </View>
  );
};

export default Login;
