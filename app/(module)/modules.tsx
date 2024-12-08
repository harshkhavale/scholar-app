import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
  Button,
  Image,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAuthStore } from "@/store/auth-store";
import { Module, Modules } from "@/types/types";
import axios from "axios";
import { BASE_URL } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import VideoScreen from "@/components/VideoScreen";
import { notfound } from "@/assets";
import { AnimatedScrollView } from "react-native-reanimated/lib/typescript/component/ScrollView";
import Animated, { FadeInDown, FadeInLeft } from "react-native-reanimated";

const ModulesScreen = () => {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const { user } = useAuthStore();
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  // Fetch all modules for the course
  const fetchCourseModules = async (courseId?: string): Promise<Modules> => {
    const response = await axios.get<Modules>(
      `${BASE_URL}/api/courses/${courseId}/modules`
    );
    return response.data;
  };

  // Fetch details for a single module
  const fetchModuleDetails = async (moduleId: string): Promise<Module> => {
    const response = await axios.get<Module>(
      `${BASE_URL}/api/modules/${moduleId}`
    );
    return response.data;
  };

  const {
    data: modulesData,
    error: modulesError,
    isLoading: modulesIsLoading,
  } = useQuery<Modules>({
    queryKey: ["course-modules", courseId],
    queryFn: () => fetchCourseModules(courseId || ""),
    enabled: !!courseId,
  });

  const {
    data: moduleDetails,
    error: moduleError,
    isLoading: moduleIsLoading,
  } = useQuery<Module>({
    queryKey: ["module-details", selectedModule?._id],
    queryFn: () =>
      selectedModule ? fetchModuleDetails(selectedModule._id) : null,
    enabled: !!selectedModule,
  });

  const Drawer = () => (
    <Animated.View
      entering={FadeInLeft.duration(300).delay(200).springify()}
      className="absolute top-0 left-0 pt-10 w-3/4 h-full bg-white p-4 z-50 shadow-lg"
    >
      <Text
        style={{ fontFamily: "Font" }}
        className="text-xl font-bold mb-4 text-gray-900"
      >
        Modules
      </Text>
      <ScrollView>
        {modulesData?.modules?.map((module) => (
          <Pressable
            key={module._id}
            onPress={() => {
              setSelectedModule(module);
              setToggleDrawer(false);
            }}
            className="p-3 mb-2 border-l-8 border-orange-500 bg-gray-50 rounded"
          >
            <Text style={{ fontFamily: "Font" }} className="">
              {module.title}
            </Text>
            <Text className="text-xs" style={{ fontFamily: "Font" }}>
              course last updated on
              {new Date(module?.updatedAt).toLocaleDateString()}
            </Text>
          </Pressable>
        ))}
        {modulesError && (
          <Text style={{ fontFamily: "Font" }} className="text-red-400 mt-4">
            Error fetching modules: {modulesError.message}
          </Text>
        )}
        {modulesIsLoading && (
          <Text style={{ fontFamily: "Font" }} className="text-gray-400 mt-4">
            Loading modules...
          </Text>
        )}
      </ScrollView>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-gray-100 mt-8">
      {/* Top Navbar */}
      <View className="flex-row items-center justify-between bg-white p-4 shadow">
        <Pressable onPress={() => router.back()}>
          <Ionicons name={"arrow-back"} size={30} color="black" />
        </Pressable>
        <Text style={{ fontFamily: "Font" }} className="text-xl text-gray-800">
          Modules
        </Text>
        <Pressable onPress={() => setToggleDrawer(!toggleDrawer)}>
          <Ionicons
            name={toggleDrawer ? "close" : "menu"}
            size={30}
            color="#FF8C00"
          />
        </Pressable>
      </View>

      {/* Drawer */}
      {toggleDrawer && <Drawer />}

      {/* Main Content */}
      <View className="p-4">
        {moduleIsLoading ? (
          <ActivityIndicator size="large" color="#FF8C00" />
        ) : moduleError ? (
          <Text className="text-red-600">Error loading module details.</Text>
        ) : moduleDetails ? (
          <ScrollView>
            <Text
              style={{ fontFamily: "Font" }}
              className="text-2xl font-bold text-gray-800 mb-2"
            >
              {moduleDetails.title}
            </Text>
            <Text style={{ fontFamily: "Font" }} className="text-gray-600 mb-4">
              {moduleDetails.description}
            </Text>

            {/* Video Section */}
            {moduleDetails.resources.video ? (
              <View>
                <VideoScreen
                  videoSource={`${BASE_URL}/uploads/resources/${moduleDetails.resources.video}`}
                />
                <Text
                  style={{ fontFamily: "Font" }}
                  className="text-center text-blue-600 mt-4"
                >
                  Watch the video above.
                </Text>
              </View>
            ) : (
              <Text style={{ fontFamily: "Font" }} className="text-gray-600">
                No video available for this module.
              </Text>
            )}

            {/* Document Section */}
            {moduleDetails.resources.doc && (
              <View className="mt-4">
                <Button
                  title="View Document"
                  onPress={() =>
                    Alert.alert(
                      "Document",
                      `Available at: ${BASE_URL}/uploads/resources/${moduleDetails.resources.doc}`
                    )
                  }
                />
              </View>
            )}
          </ScrollView>
        ) : (
          <View className=" flex-col justify-center items-center pt-20">
            <Image source={notfound} className="h-40 w-40" />
            <Text
              style={{ fontFamily: "Font" }}
              className="text-gray-600 text-2xl text-center py-8"
            >
              Select a module to start learnings.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default ModulesScreen;
