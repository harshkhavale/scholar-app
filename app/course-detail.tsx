import { View, Text, Image, Pressable, TextInput } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Course, Modules } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ModuleList from "@/components/ModuleList";
import Animated, { FadeInDown } from "react-native-reanimated";
import Button from "@/components/Button";
import { BASE_URL } from "@/utils/endpoints";

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
    <View className="flex-row mb-6 bg-gray-200 rounded-xl p-2 mt-8 shadow-lg">
      <Pressable
        onPress={() => onSegmentChange("module")}
        className={`flex-1 py-3 rounded-lg ${
          selectedSegment === "module" ? "bg-orange-500" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center ${
            selectedSegment === "module" ? "text-white font-semibold" : "text-gray-700"
          }`}
        >
          Modules
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onSegmentChange("reviews")}
        className={`flex-1 py-3 rounded-lg ${
          selectedSegment === "reviews" ? "bg-orange-500" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center ${
            selectedSegment === "reviews" ? "text-white font-semibold" : "text-gray-700"
          }`}
        >
          Reviews
        </Text>
      </Pressable>
    </View>
  );
};

const CourseDetail = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [selectedSegment, setSelectedSegment] = useState<"module" | "reviews">("module");

  const { data, error, isLoading, refetch } = useQuery<Course>({
    queryKey: ["course-details", courseId],
    queryFn: () => fetchCourseDetail(courseId || ""),
    enabled: true,
  });

  const { data: modulesData, error: modulesError, isLoading: modulesIsLoading, refetch: modulesRefetch } = useQuery<Modules>({
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
          className="w-full h-72 rounded-lg shadow-xl"
        />
      }
    >
      <View className="">
        {/* Language Badge */}
        <View className="bg-lime-500 rounded-xl p-2 mb-4 w-32 justify-center items-center">
          <Text className="text-white text-base">{data?.languages?.at(0)}</Text>
        </View>

        {/* Course Title */}
        <Text className=" text-3xl">{data?.title}</Text>
        <Text className=" text-gray-700 text-xl">{data?.description}</Text>

        {/* Course Price */}
        <Text className="text-3xl text-gray-700 mt-4">
          {data?.price ? data?.price : "Free"}
        </Text>

        {/* Segmented Control */}
        <SegmentedControl selectedSegment={selectedSegment} onSegmentChange={setSelectedSegment} />

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

      {/* Enroll Button */}
      <Animated.View
        entering={FadeInDown.duration(300).delay(600).springify()}
        className="w-full flex justify-center items-center mb-8"
      >
        <Button title="Enroll Now" action={() => console.log("Enrolled")} />
      </Animated.View>
    </ParallaxScrollView>
  );
};

export default CourseDetail;
