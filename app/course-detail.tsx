import { View, Text, Image, Pressable, Module } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import { Course, Modules } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import ModuleList from "@/components/ModuleList";
import Animated, { FadeInDown } from "react-native-reanimated";
import Button from "@/components/Button";
const fetchCourseDetail = async (courseId?: string): Promise<Course> => {
  try {
    const response = await axios.get<Course>(
      `http://192.168.0.104:5000/api/courses/${courseId}`
      //   , {
      //   params: { search: searchTerm },
      //   headers: {
      //     Authorization: `Bearer ${Constants.extra?.token}`,
      //   },
      // }
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
      `http://192.168.0.104:5000/api/courses/${courseId}/modules`
      //   , {
      //   params: { search: searchTerm },
      //   headers: {
      //     Authorization: `Bearer ${Constants.extra?.token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
const fetchCourseReviews = async (courseId?: string): Promise<Module[]> => {
  try {
    const response = await axios.get<Module[]>(
      `http://192.168.0.104:5000/api/courses/${courseId}/modules`
      //   , {
      //   params: { search: searchTerm },
      //   headers: {
      //     Authorization: `Bearer ${Constants.extra?.token}`,
      //   },
      // }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
};
const SegmentedControl: React.FC<{
  selectedSegment: "module" | "reviews";
  onSegmentChange: (segment: "module" | "reviews") => void;
}> = ({ selectedSegment, onSegmentChange }) => {
  return (
    <View className="flex-row mb-4 bg-gray-200 rounded-lg p-1 mt-6">
      {/* Module Button */}
      <Pressable
        onPress={() => onSegmentChange("module")}
        className={`flex-1 py-3 rounded-md ${
          selectedSegment === "module" ? "bg-orange-700" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center ${
            selectedSegment === "module" ? "text-white font-bold" : "text-gray-700"
          }`}
        >
          Module
        </Text>
      </Pressable>

      {/* Reviews Button */}
      <Pressable
        onPress={() => onSegmentChange("reviews")}
        className={`flex-1 py-3 rounded-md ${
          selectedSegment === "reviews" ? "bg-orange-700" : "bg-transparent"
        }`}
      >
        <Text
          className={`text-center ${
            selectedSegment === "reviews" ? "text-white font-bold" : "text-gray-700"
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
  // #course-details
  const { data, error, isLoading, refetch } = useQuery<Course>({
    queryKey: ["course-details", courseId],
    queryFn: () => fetchCourseDetail(courseId || ""),
    enabled: true,
  });
    // #course-modules
  const { data:modulesData, error:modulesError, isLoading:modulesIsLoading, refetch:modulesRefetch } = useQuery<Modules>({
    queryKey: ["course-modules", courseId],
    queryFn: () => fetchCourseModules(courseId || ""),
    enabled: !!courseId
  });
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri: `http://192.168.0.104:5000/uploads/thumbnails/${data?.thumbnail}`,
          }}
          className="w-full h-72 rounded-lg"
        />
      }
    >
      <View className="">
        <View className="bg-orange-500 rounded-xl p-0.5 mb-4 w-32 justify-center items-center">
          <Text style={{ fontFamily: "Font" }} className="text-base text-white">
            {data?.languages?.at(0)}
          </Text>
        </View>
        <Text style={{ fontFamily: "Font" }} className="font-bold text-2xl">
          {data?.title}
        </Text>

        <Text style={{ fontFamily: "Font" }} className="text-3xl mt-6">
          {data?.price ? data?.price : "Free"}
        </Text>
        <SegmentedControl selectedSegment={selectedSegment}
        onSegmentChange={setSelectedSegment}/>

        {
          selectedSegment === "module" ? (
            <View className="mt-6">
             
              <ModuleList onLoadMore={modulesRefetch} modulesData={modulesData} isLoading={modulesIsLoading} />
            </View>
          ):(
            <View className="mt-6">
              <Text style={{ fontFamily: "Font" }} className="font-bold text-lg">
                Reviews
              </Text>
              {/* {data?.reviews?.map((review, index) => (
                <Text key={index} style={{ fontFamily: "Font" }} className="text-xl mt-2">
                  {review}
                </Text>
              ))} */}
            </View>
          )
        }
      </View>
      <Animated.View
        entering={FadeInDown.duration(300).delay(600).springify()}
        className="w-full flex justify-center items-center"
      >
        <Button title="Enroll" action={()=>(console.log("ENROLL"))} />
      </Animated.View>
    </ParallaxScrollView>
  );
};

export default CourseDetail;
