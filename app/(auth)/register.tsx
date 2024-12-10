import React, { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import axios from "axios";
import Toast from "react-native-toast-message";
import { BASE_URL } from "@/utils/endpoints";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const { userType, plan } = useLocalSearchParams();

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePassword = (password: string) => password.length >= 8;

  const handleRegister = async () => {
    if (!fullName) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Full name is required.",
      });
      return;
    }
  
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Email is required.",
      });
      return;
    }
  
    if (!validateEmail(email)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Please enter a valid email address.",
      });
      return;
    }
  
    if (!password) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password is required.",
      });
      return;
    }
  
    if (!validatePassword(password)) {
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: "Password must be at least 8 characters long.",
      });
      return;
    }
  
    if (userType == null) {
      router.push("/role"); // Redirect to roles selection screen
      return;
    }
  
    try {
      const formatedemail = email.toLowerCase();
  
      const response = await axios.post(
        `${BASE_URL}/api/auth/register`,
        {
          fullName,
          email: formatedemail,
          password,
          userType,
          plan: plan || "free", // Default plan to "free" if not provided
        },{
          headers:{
            "Cache-Control": "no-cache",
          }
        }
      );
  
      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Registration Successful",
          text2: "You can now log in with your credentials.",
        });
  
        // Delay the route transition to allow the toast to be visible
        setTimeout(() => {
          router.push("/(auth)/login");
        }, 2000); // 2-second delay
      } else {
        Toast.show({
          type: "error",
          text1: "Registration Failed",
          text2: response.data.message || "Something went wrong. Try again.",
        });
        console.log(fullName, email, password, userType);
      }
    } catch (error: any) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          error.response?.data?.message || "Network error. Please try again.",
      });
      console.log(fullName, email, password, userType);
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
          Get started for your career growth: Register
        </Text>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(300).delay(400).springify()}
        className="w-full p-4"
      >
        <View className="flex-col gap-4 items-center rounded-2xl p-4 mt-4">
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={{ fontFamily: "Font" }}
            placeholder="Full Name"
            className="border-2 w-full rounded-2xl p-4 text-xl border-gray-400"
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={{ fontFamily: "Font" }}
            placeholder="johndoe@gmail.com"
            className="border-2 w-full rounded-2xl p-4 text-xl border-gray-400"
          />
          <View className="relative w-full">
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              style={{ fontFamily: "Font" }}
              placeholder="Password@123"
              className="border-2 w-full rounded-2xl p-4 text-xl border-gray-400"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-5"
            >
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </Pressable>
          </View>
        </View>

        

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
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(300).delay(600).springify()}
        className="w-full flex justify-center items-center"
      >
        <Button title="Register" action={handleRegister} />
      </Animated.View>
      <View className="flex-row gap-2 justify-center mt-8">
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

export default Register;
