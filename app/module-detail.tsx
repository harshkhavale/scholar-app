import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Alert, Button } from "react-native";
import { useEvent } from "expo";
import { useVideoPlayer } from "expo-video";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import * as Print from "expo-print";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { WebView } from "react-native-webview";  // WebView to render PDFs
import { BASE_URL } from "@/utils/endpoints";
import VideoScreen from "@/components/VideoScreen";

interface Module {
  title: string;
  description: string;
  resources: {
    doc?: string; // Path to course-related documents
    video?: string; // Path to course-related videos
  };
}

// Fetch module data by moduleId
const fetchModule = async (moduleId: string): Promise<Module> => {
  const response = await axios.get<Module>(`${BASE_URL}/api/modules/${moduleId}`);
  return response.data;
};

const ModuleComponent = () => {
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const [textContent, setTextContent] = useState<string | null>(null);
  const [pdfContentUri, setPdfContentUri] = useState<string | null>(null);

  const { data: module, isLoading, error } = useQuery<Module>({
    queryKey: ["module", moduleId],
    queryFn: () => fetchModule(moduleId || ""),
    enabled: !!moduleId,
  });

  const videoSource = module?.resources.video
    ? `${BASE_URL}/uploads/resources/${module.resources.video}`
    : null;

  const player = useVideoPlayer(videoSource || "", (player) => {
    player.loop = false;
  });

  const { isPlaying } = useEvent(player, "playingChange", {
    isPlaying: player.playing,
  });

  useEffect(() => {
    if (module?.resources.doc) {
      if (module.resources.doc.endsWith(".txt")) {
        axios
          .get(module.resources.doc)
          .then((response) => setTextContent(response.data))
          .catch((err) => {
            console.error("Error fetching document content:", err);
            Alert.alert("Error", "Failed to load document content.");
          });
      } else if (module.resources.doc.endsWith(".pdf")) {
        const pdfUrl = `${BASE_URL}/uploads/resources/${module.resources.doc}`;
        setPdfContentUri(pdfUrl);
      }
    }
  }, [module]);

  

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text className="text-gray-600 mt-4">Loading module...</Text>
      </View>
    );
  }

  if (error || !module) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-600 text-lg">Error loading module. Please try again.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      {/* Video Section */}
      {videoSource ? (
        <View className="mb-6">
          <VideoScreen videoSource={videoSource} />
          <View className="mt-4">
            <Text className="text-xl font-semibold text-gray-800">{module.title}</Text>
            <Text className="text-base text-gray-600 mt-2">{module.description}</Text>
            <Button
              title={isPlaying ? "Pause Video" : "Play Video"}
              onPress={() => (isPlaying ? player.pause() : player.play())}
            />
          </View>
        </View>
      ) : (
        <Text className="text-gray-600 text-center">No video available for this module.</Text>
      )}

      
    </ScrollView>
  );
};

export default ModuleComponent;
