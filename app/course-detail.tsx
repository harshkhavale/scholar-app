import { View, Text, Image } from "react-native";
import React from "react";
import axios from "axios";
import { Course } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/ParallaxScrollView";

const CourseDetail = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const fetchCourseDetail = async (courseId?: string): Promise<Course> => {
    try {
      const response = await axios.get<Course>(
        `http://192.168.153.167:5000/api/courses/${courseId}`
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
  const { data, error, isLoading, refetch } = useQuery<Course>({
    queryKey: ["search-courses", courseId],
    queryFn: () => fetchCourseDetail(courseId || ""),
    enabled: true,
  });
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Image
          source={{
            uri: `http://192.168.153.167:5000/uploads/thumbnails/${data?.thumbnail}`,
          }}
          className="w-full h-72 rounded-lg"
        />
      }
    >
      <View className="">
        <View className="bg-orange-700 rounded-xl p-0.5 mb-4 w-32 justify-center items-center">
          <Text style={{ fontFamily: "Font" }} className="text-base text-white">
            {data?.languages?.at(0)}
          </Text>
        </View>
        <Text style={{ fontFamily: "Font" }} className="text-3xl">
            {data?.title}
          </Text>
      </View>
    </ParallaxScrollView>
  );
};

export default CourseDetail;
