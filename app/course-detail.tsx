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
    <View className="flex-row mb-6 rounded-xl p-2 mt-8 border-2 border-gray-200">
      <Pressable
        onPress={() => onSegmentChange("module")}
        className={`flex-1 py-3 rounded-lg ${
          selectedSegment === "module" ? "border-2 border-orange-500" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center ${
            selectedSegment === "module" ? "text-orange-500 font-semibold" : "text-gray-700"
          }`}
          style={{fontFamily:"Font"}}
        >
          Modules
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onSegmentChange("reviews")}
        className={`flex-1 py-3 rounded-lg ${
          selectedSegment === "reviews" ? "border-2 border-orange-500" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center ${
            selectedSegment === "reviews" ? "text-orange-500 font-semibold" : "text-gray-700"
          }`}
          style={{fontFamily:"Font"}}
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
        <View className=" flex-row gap-2 items-center">
          {
            data?.languages?.map((language,index) =>(
              <Text className="text-white bg-green-500 rounded-full p-2 text-xs mb-4 w-min">{language}</Text>

            ))
          }
        </View>

        {/* Course Title */}
        <Text className=" text-3xl">{data?.title}</Text>
        <Text className=" text-gray-700 text-base">{data?.description}</Text>

        {/* Course Price */}
        <Text className="text-5xl text-gray-700 mt-8 font-bold text-center">
          {data?.price ? "$"+data?.price : "FREE"}
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
      <Button title="add module" action={() =>router.push({pathname:"/(module)/create-module",params:{courseId:courseId}})} />

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
