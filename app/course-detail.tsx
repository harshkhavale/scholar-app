import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Course, Modules } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ModuleList from "@/components/ModuleList";
import Animated, { FadeInDown } from "react-native-reanimated";
import { BASE_URL } from "@/utils/endpoints";
import { useStripe } from "@stripe/stripe-react-native";
import Toast from "react-native-toast-message";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useAuthStore } from "@/store/auth-store";

// Fetch course, modules, and reviews data
const fetchCourseDetail = async (courseId?: string): Promise<Course> => {
  try {
    const response = await axios.get<Course>(
      `${BASE_URL}/api/courses/${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};

const fetchCourseModules = async (courseId?: string): Promise<Modules> => {
  try {
    const response = await axios.get<Modules>(
      `${BASE_URL}/api/courses/${courseId}/modules`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching modules:", error);
    throw error;
  }
};

// Segmented control component for "Module" and "Reviews"
const SegmentedControl: React.FC<{
  selectedSegment: "module" | "reviews";
  onSegmentChange: (segment: "module" | "reviews") => void;
}> = ({ selectedSegment, onSegmentChange }) => {
  return (
    <View className="flex-row mb-12 rounded-xl p-2 mt-8 border-2 border-gray-200">
      <Pressable
        onPress={() => onSegmentChange("module")}
        className={`flex-1 py-3 rounded-lg ${
          selectedSegment === "module"
            ? "border-2 border-orange-500"
            : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center ${
            selectedSegment === "module"
              ? "text-orange-500 font-semibold"
              : "text-gray-700"
          }`}
          style={{ fontFamily: "Font" }}
        >
          Modules
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onSegmentChange("reviews")}
        className={`flex-1 py-3 rounded-lg ${
          selectedSegment === "reviews"
            ? "border-2 border-orange-500"
            : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center ${
            selectedSegment === "reviews"
              ? "text-orange-500 font-semibold"
              : "text-gray-700"
          }`}
          style={{ fontFamily: "Font" }}
        >
          Reviews
        </Text>
      </Pressable>
    </View>
  );
};

const CourseDetail = ({ navigation }: any) => {
  const { user, educator, updateUser } = useAuthStore();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [selectedSegment, setSelectedSegment] = useState<"module" | "reviews">(
    "module"
  );

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const enrollCourse = async () => {
    const { user, updateUser } = useAuthStore.getState();

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/enroll`,
        { userId: user?.id, courseId: courseId }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      if (response.status === 200) {
        // Update the user's enrolls in the store
        updateUser({
          enrolls: [...(user?.enrolls || []), courseId],
        });
        Toast.show({
          type: "success",
          text1: "Course enrolled successfully",
        });
        console.log("Course enrolled successfully:", response.data);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
      console.error("Error enrolling course:", error);
    }
  };
  const unrollCourse = async () => {
    const { user, updateUser } = useAuthStore.getState();

    try {
      const response = await axios.post(
        `${BASE_URL}/api/users/unroll`,
        { userId: user?.id, courseId: courseId }
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      if (response.status === 200) {
        // Remove the course from the user's enrolls
        updateUser({
          enrolls: user?.enrolls?.filter((id) => id !== courseId), // Filter out the courseId
        });
        console.log("Course unrolled successfully:", response.data);
        Toast.show({
          type: "success",
          text1: "Course unrolled successfully!",
        });
      }
    } catch (error) {
      console.error("Error unrolling course:", error);
      Toast.show({
        type: "error",
        text1: "Something went wrong",
      });
    }
  };

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
  const handlePayment = async (amount: number) => {
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
        }

        // Present the Payment Sheet
        const { error: paymentError } = await presentPaymentSheet();
      }
      await enrollCourse();
    } catch (error) {
      console.error("Payment failed", error);
    }

    setLoading(false);
  };
  const { data, error, isLoading, refetch } = useQuery<Course>({
    queryKey: ["course-details", courseId],
    queryFn: () => fetchCourseDetail(courseId || ""),
    enabled: true,
  });

  const {
    data: modulesData,
    error: modulesError,
    isLoading: modulesIsLoading,
    refetch: modulesRefetch,
  } = useQuery<Modules>({
    queryKey: ["course-modules", courseId],
    queryFn: () => fetchCourseModules(courseId || ""),
    enabled: !!courseId,
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri: `${BASE_URL}/uploads/thumbnails/${data?.thumbnail}`,
          }}
          className="w-full h-72 relative rounded-lg shadow-xl"
        />
      }
    >
      <View className="">
        {/* Language Badge */}
        <View className=" flex-row gap-2 items-center">
          {data?.languages?.map((language, index) => (
            <Text className="text-white bg-green-500 rounded-full p-2 text-xs mb-4 w-min">
              {language}
            </Text>
          ))}
        </View>

        {/* Course Title */}
        <Text style={{ fontFamily: "Font" }} className=" text-3xl">
          {data?.title}
        </Text>
        <Text
          style={{ fontFamily: "Font" }}
          className=" text-gray-700 my-4 text-pretty text-base"
        >
          {data?.description}
        </Text>

        {/* Course Price */}
        <Text
          style={{ fontFamily: "Font" }}
          className="text-5xl text-gray-700 mt-8 font-bold text-center"
        >
          {data?.price ? "$" + data?.price : "FREE"}
        </Text>

        {/* Segmented Control */}
        <SegmentedControl
          selectedSegment={selectedSegment}
          onSegmentChange={setSelectedSegment}
        />

        {/* Conditional Display: Modules or Reviews */}
        {selectedSegment === "module" ? (
          <View className="mt-6">
            <ModuleList
              onLoadMore={modulesRefetch}
              modulesData={modulesData}
              isLoading={modulesIsLoading}
            />
          </View>
        ) : (
          <View className="mt-6">
            <Text className="font-semibold text-lg">Reviews</Text>
            {/* Map through reviews if available */}
            {/* {data?.reviews?.map((review, index) => (
              <Text key={index} className="text-xl mt-2">
                {review}
              </Text>
            ))} */}
          </View>
        )}
      </View>
      {user?.userType === "educator" && data?.educator === educator?._id && (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/(module)/create-module",
              params: { courseId: courseId },
            })
          }
          className=" absolute top-2 right-2 m-2 p-2 h-12 w-12 flex justify-center items-center rounded-xl"
        >
          <MaterialIcons name="playlist-add" size={30} color="#1E90FF" />
        </TouchableOpacity>
      )}

      <Animated.View
        entering={FadeInDown.duration(300).delay(600).springify()}
        className="w-full flex justify-center items-center mb-8"
      >
        {user?.enrolls?.includes(courseId) ? (
          <Pressable
            className="bg-red-400 fixed bottom p-2 px-4 mb-10 rounded-2xl w-full flex justify-center items-center"
            onPress={unrollCourse}
          >
            <Text className="text-white text-xl" style={{ fontFamily: "Font" }}>
              {loading ? "Wait a minute" : "Unroll from Course"}
            </Text>
          </Pressable>
        ) : (
          <Pressable
            className="bg-blue-500 fixed bottom p-2 px-4 mb-10 rounded-2xl w-full flex justify-center items-center"
            onPress={() => handlePayment(data?.price ? 200 : 200)}
          >
            <Text className="text-white text-xl" style={{ fontFamily: "Font" }}>
              {loading ? "Wait a minute" : "Enroll Now"}
            </Text>
          </Pressable>
        )}
      </Animated.View>
    </ParallaxScrollView>
  );
};

export default CourseDetail;
