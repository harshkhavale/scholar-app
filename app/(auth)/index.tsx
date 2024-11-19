import { View, Text, Pressable, ScrollView } from "react-native";
import React from "react";
import Animated, { FadeInDown, FadeInLeft, FadeInRight } from "react-native-reanimated";
import { router } from "expo-router";
import Button from "@/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";

const plans = [
  { id: "basic", name: "Basic Plan", price: "₹199", benefits: ["1 Project", "Basic Support", "Access to Tutorials"] },
  { id: "standard", name: "Standard Plan", price: "₹499", benefits: ["5 Projects", "Priority Support", "Access to All Tutorials"] },
  { id: "premium", name: "Premium Plan", price: "₹999", benefits: ["Unlimited Projects", "24/7 Support", "Exclusive Content Access"] },
];

const PricingScreen = () => {
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, alignItems: 'center', paddingVertical: 20 }}>
      <Animated.View
        entering={FadeInRight.duration(300).delay(200).springify()}
        className="w-full px-6 mb-8"
      >
        <Text
          style={{ fontFamily: "Font" }}
          className="text-4xl text-center leading-[3.5rem]"
        >
          Choose Your Plan
        </Text>
      </Animated.View>
      
      {plans.map((plan, index) => (
        <Animated.View
          key={plan.id}
          entering={FadeInLeft.duration(300).delay(400 + index * 200).springify()}
          className="w-11/12 mb-6 p-6 rounded-2xl bg-white border border-gray-300 shadow-md"
        >
          <Text style={{ fontFamily: "Font" }} className="text-2xl text-orange-500 mb-2">
            {plan.name}
          </Text>
          <Text style={{ fontFamily: "Font" }} className="text-4xl mb-4">
            {plan.price}
          </Text>
          {plan.benefits.map((benefit, idx) => (
            <View key={idx} className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#FFA500" />
              <Text style={{ fontFamily: "Font" }} className="ml-2 text-gray-500">
                {benefit}
              </Text>
            </View>
          ))}
          <Pressable
            onPress={() => router.push("/(auth)/register")}
            className="mt-4 bg-orange-500 py-3 rounded-2xl"
          >
            <Text
              style={{ fontFamily: "Font" }}
              className="text-center text-white font-semibold text-lg"
            >
              Choose {plan.name}
            </Text>
          </Pressable>
        </Animated.View>
      ))}

     
    </ScrollView>
  );
};

export default PricingScreen;
