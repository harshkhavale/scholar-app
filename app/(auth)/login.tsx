import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { router } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import Button from "@/components/Button";
import axios from "axios";
import Toast from "react-native-toast-message";
import { AUTH, BASE_URL } from "@/utils/endpoints";
import { Auth } from "@/types/types";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogin = async () => {
    try {
      const formatedemail = email.toLowerCase();
      const response = await axios.post<Auth>(
        `${BASE_URL}/api/auth/login`,
        {
          email: formatedemail,
          password,
        }
      );
  
      const data = response.data;
  
      if (response.status === 200) {
        setUser(data.user);
        setToken(data.token);
  
        // Show success toast and delay navigation
        Toast.show({
          type: "success",
          text1: "Login Successful",
          text2: "Welcome back!",
        });
  
        setTimeout(() => {
          router.push("/(tabs)");
        }, 2000); // 2-second delay for the toast
      } else {
        Toast.show({
          type: "error",
          text1: "Login Failed",
          text2: data.message || "Something went wrong",
        });
      }
    } catch (error: any) {
      console.error(error);
  
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message || "Network error. Please try again.",
      });
    }
  };
  

  return (
    <View className="gap-4 flex-1 w-full justify-center items-center">
      <Animated.View
        entering={FadeInDown.duration(300).delay(200).springify()}
        className="w-full"
      >
        <Text
          style={{ fontFamily: "Font" }}
          className="text-5xl text-orange-500 ps-4 leading-[3.5rem]"
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
            value={email}
            onChangeText={setEmail}
            style={{ fontFamily: "Font" }}
            placeholder="johndoe@gmail.com"
            className="border-2 w-full border-gray-400 rounded-2xl text-xl p-4"
          />
          <View className="relative w-full">
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
              style={{ fontFamily: "Font" }}
              placeholder="Password@123"
              className="border-2 border-gray-400 w-full rounded-2xl text-xl p-4"
            />
            <Pressable
              onPress={() => setPasswordVisible(!passwordVisible)}
              className="absolute right-4 top-4"
            >
              <Ionicons
                name={passwordVisible ? "eye" : "eye-off"}
                size={24}
                color="gray"
              />
            </Pressable>
          </View>
        </View>
       
        <View className=" flex-row items-center justify-center gap-2">
        <Text> Don't have any account ?</Text>
        <Pressable onPress={() => router.push("/role")}>
          <Text
            style={{ fontFamily: "Font" }}
            className="text-orange-500 text-lg"
          >
            Register
          </Text>
        </Pressable>
      </View>
      </Animated.View>
      <Animated.View
        entering={FadeInDown.duration(300).delay(600).springify()}
        className="w-full flex justify-center items-center"
      >
        <Button title="Login" action={handleLogin} />
      </Animated.View>
      <View className="flex-row gap-2 mt-8 justify-center">
          <Pressable
            onPress={() => router.push("/")}
            className="flex-row items-center justify-center gap-2 border-2 px-4 border-gray-400"
          >
            <AntDesign name="google" size={30} color="gray" />
            <Text
              style={{ fontFamily: "Font" }}
              className="text-center leading-[3.5rem]"
            >
              Google
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/")}
            className="flex-row items-center justify-center gap-2 border-2 px-4 border-gray-400"
          >
            <AntDesign name="github" size={30} color="gray" />
            <Text
              style={{ fontFamily: "Font" }}
              className="text-center leading-[3.5rem]"
            >
              GitHub
            </Text>
          </Pressable>
        </View>
      <Toast />
    </View>
  );
};

export default Login;
