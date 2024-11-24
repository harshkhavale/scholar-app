import { View, Text, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import Animated, {
  FadeInDown,
  FadeInLeft,
  FadeInRight,
} from "react-native-reanimated";
import { router, useLocalSearchParams } from "expo-router";
import Button from "@/components/Button";
import Ionicons from "@expo/vector-icons/Ionicons";
import axios from "axios";
import { BASE_URL } from "@/utils/endpoints";
import { useStripe } from "@stripe/stripe-react-native";
import Toast from "react-native-toast-message";

const plans = [
  {
    id: "free",
    name: "Basic Plan",
    price: "Free",
    benefits: ["1 Project", "Basic Support", "Access to Tutorials"],
    amount: 0,
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: "₹499",
    benefits: ["5 Projects", "Priority Support", "Access to All Tutorials"],
    amount: 49900,
  },
  {
    id: "enterprise",
    name: "Enterprise Plan",
    price: "₹999",
    benefits: [
      "Unlimited Projects",
      "24/7 Support",
      "Exclusive Content Access",
    ],
    amount: 99900,
  },
];

const PricingScreen = () => {
  const { userType } = useLocalSearchParams();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const fetchPaymentIntentClientSecret = async (amount: number) => {
    try {
      // Call your backend to create a PaymentIntent
      const response = await axios.post(
        `${BASE_URL}/api/payments/create-payment-intent`,
        {
          amount: amount, // Amount in cents
        }
      );

      if (!response.data || !response.data.clientSecret) {
        throw new Error("Invalid response from backend. Missing clientSecret.");
      }

      return response.data.clientSecret;
    } catch (error: any) {
      if (error.response) {
        console.error("Backend Error:", error.response.data);
      } else if (error.request) {
        console.error("No Response from Backend:", error.request);
      } else {
        console.error("Error Setting Up Request:", error.message);
      }
      throw error; // Propagate the error for further handling
    }
  };

  const handlePayment = async (planId: string, amount: number) => {
    setLoading(true);

    try {
      if (amount > 0) {
        // Fetch the client secret from the backend
        const clientSecret = await fetchPaymentIntentClientSecret(amount); // This should come from your server

        // Initialize the Payment Sheet
        const { error: initError } = await initPaymentSheet({
          paymentIntentClientSecret: clientSecret,
          merchantDisplayName: "Scholar", // Display the merchant name
        });

        if (initError) {
          console.error(initError);
          setLoading(false);
          return;
        }

        // Present the Payment Sheet
        const { error: paymentError } = await presentPaymentSheet();

        if (paymentError) {
          console.error(paymentError);
          Toast.show({
            type: "error",
            text1: "Payment Failed!",
          });
        } else {
          Toast.show({
            type: "success",
            text1: "Payment Successful",
            text2: "let's go....!",
          });
          console.log("Payment completed successfully");
          router.push({
            pathname: "/register",
            params: { userType: userType, plan: planId },
          });
        }
      }else{
        router.push({
          pathname: "/register",
          params: { userType: userType, plan: planId },
        });
      }
    } catch (error) {
      console.error("Payment failed", error);
    }

    setLoading(false);
  };
  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "center",
        paddingVertical: 20,
      }}
    >
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
          entering={FadeInLeft.duration(300)
            .delay(400 + index * 200)
            .springify()}
          className="w-11/12 mb-6 p-6 rounded-2xl bg-white border border-gray-300 shadow-md"
        >
          <Text
            style={{ fontFamily: "Font" }}
            className="text-2xl text-orange-500 mb-2"
          >
            {plan.name}
          </Text>
          <Text style={{ fontFamily: "Font" }} className="text-4xl mb-4">
            {plan.price}
          </Text>
          {plan.benefits.map((benefit, idx) => (
            <View key={idx} className="flex-row items-center mb-2">
              <Ionicons name="checkmark-circle" size={20} color="#FFA500" />
              <Text
                style={{ fontFamily: "Font" }}
                className="ml-2 text-gray-500"
              >
                {benefit}
              </Text>
            </View>
          ))}
          <Pressable
            onPress={() => handlePayment(plan.id, plan.amount)}
            disabled={loading}
            className="mt-4 bg-orange-500 py-3 rounded-2xl"
          >
            <Text
              style={{ fontFamily: "Font" }}
              className="text-center text-white font-semibold text-lg"
            >
              {loading ? "Processing Payment..." : "Pay Now"}
            </Text>
          </Pressable>
        </Animated.View>
      ))}
    </ScrollView>
  );
};

export default PricingScreen;
