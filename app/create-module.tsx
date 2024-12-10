import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "@/utils/endpoints";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { router, useLocalSearchParams } from "expo-router";

const CreateModule = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [doc, setDoc] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const showToast = (type: "success" | "error", text1: string, text2?: string) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "top",
    });
  };

  const handleDocumentPicker = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/*",
      copyToCacheDirectory: true,
    });

    if (result.type !== "cancel") {
      setDoc(result.uri);
    }
  };

  const handleVideoPicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !courseId) {
      Alert.alert("Error", "Title, description, and course association are required.");
      return;
    }
  
    setIsSubmitting(true);
  
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("course", courseId);
  
    if (doc) {
      formData.append("doc", {
        uri: doc,
        type: "application/pdf",
        name: "document.pdf",
      });
    }
  
    if (video) {
      formData.append("video", {
        uri: video,
        type: "video/mp4",
        name: "video.mp4",
      });
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/api/modules`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Cache-Control": "no-cache",
        },
      });
  
      if (response.status === 201) {
        const moduleId = response.data._id; // Assuming the response includes the module's ID.
  
        // Now update the course with the new module.
        await axios.put(
          `${BASE_URL}/api/courses/${courseId}/modules/${moduleId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
          }
        );
  
        showToast("success", "Module created and course updated successfully!", "Now add resources if required.");
        setTitle("");
        setDescription("");
        setDoc(null);
        setVideo(null);
      } else {
        showToast("error", "Failed to create module!", "Please try again.");
      }
    } catch (error: any) {
      showToast(
        "error",
        "An error occurred",
        error.response?.data?.message || "Unexpected error. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <ScrollView className="mt-10">
       <View className="flex-row items-center bg-white p-4 shadow gap-4 mb-10">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </Pressable>
          <Text style={{ fontFamily: "Font" }} className="text-xl text-gray-800">
            Add a New Module
          </Text>
        </View>
      <View className="p-4">
        <TextInput
          placeholder="Module Title"
          value={title}
          onChangeText={setTitle}
          className="border border-gray-300 rounded-md p-3 mb-4"
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          textAlignVertical="top"
          className="border border-gray-300 rounded-md p-3 mb-4"
        />

        <Pressable
          onPress={handleDocumentPicker}
          className="border border-dashed border-gray-300 rounded-md p-4 mb-4 flex-row items-center justify-between"
        >
          {doc ? (
            <Text className="text-gray-700">Document selected</Text>
          ) : (
            <Text className="text-gray-500">Select a Document</Text>
          )}
          <Ionicons name="document-outline" size={24} color="gray" />
        </Pressable>

        <Pressable
          onPress={handleVideoPicker}
          className="border border-dashed border-gray-300 rounded-md p-4 mb-4 flex-row items-center justify-between"
        >
          {video ? (
            <Text className="text-gray-700">Video selected</Text>
          ) : (
            <Text className="text-gray-500">Select a Video</Text>
          )}
          <Ionicons name="videocam-outline" size={24} color="gray" />
        </Pressable>

        <Pressable
          onPress={handleSubmit}
          disabled={isSubmitting}
          className={`rounded-full p-4 ${isSubmitting ? "bg-gray-300" : "bg-orange-500"}`}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-center text-white text-lg">Create Module</Text>
          )}
        </Pressable>
      </View>
      <Toast />
    </ScrollView>
  );
};

export default CreateModule;
