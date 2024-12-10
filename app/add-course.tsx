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
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { BASE_URL } from "@/utils/endpoints";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/store/auth-store";
import { router } from "expo-router";

const CreateCourse = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [languages, setLanguages] = useState("");
  const [topics, setTopics] = useState("");
  const [price, setPrice] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user, educator } = useAuthStore();

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !educator || !price || !thumbnail) {
      Alert.alert("Error", "All fields including thumbnail are required.");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("educator", educator.id);
    formData.append("price", price);
    formData.append("languages", languages);
    formData.append("topics", topics);
    formData.append("thumbnail", {
      uri: thumbnail,
      type: "image/jpeg",
      name: "thumbnail.jpg",
    });

    try {
      const response = await axios.post(`${BASE_URL}/api/courses`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Cache-Control": "no-cache",
            },
        },
        );

      if (response.status === 201) {
        Alert.alert("Success", "Course created successfully!");
        // Reset form fields
        setTitle("");
        setDescription("");
        setLanguages("");
        setTopics("");
        setPrice("");
        setThumbnail(null);
        console.log(response.data);
        router.push({pathname:"/course-detail", params: {courseId:response.data._id}});
      } else {
        Alert.alert("Error", "Failed to create the course.");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView className="mt-10">
      <View className="">
        <View className="flex-row items-center bg-white p-4 shadow gap-4 mb-10">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </Pressable>
          <Text style={{ fontFamily: "Font" }} className="text-xl text-gray-800">
            Add a New Course
          </Text>
        </View>
        <View className="p-4">
          <TextInput
            placeholder="Course Title"
            value={title}
            onChangeText={setTitle}
            style={{ fontFamily: "Font" }}
            className="border border-gray-300 rounded-md p-3 mb-4"
          />
           <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={{ fontFamily: "Font" }}
            className="border border-gray-300 h-40 rounded-md p-3 mb-4"
          />
          <TextInput
            placeholder="Languages (comma-separated)"
            value={languages}
            onChangeText={setLanguages}
            style={{ fontFamily: "Font" }}
            className="border border-gray-300 rounded-md p-3 mb-4"
          />
          <TextInput
            placeholder="Topics (comma-separated)"
            value={topics}
            onChangeText={setTopics}
            style={{ fontFamily: "Font" }}
            className="border border-gray-300 rounded-md p-3 mb-4"
          />
          <TextInput
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={{ fontFamily: "Font" }}
            className="border border-gray-300 rounded-md p-3 mb-4"
          />
          <Pressable
            onPress={handleImagePicker}
            className=" rounded-xl p-4 mb-4 border-2 border-dashed flex-row justify-between items-center"
          >
           {thumbnail ? (
            <Image
              source={{ uri: thumbnail }}
              className="h-40 w-full rounded-md mb-4"
            />
          ) : (
            <View className="h-40 w-full rounded-md mb-4 flex justify-center items-center">
              <Ionicons name="image-outline" size={40} color="gray" />
              <Text style={{ fontFamily: "Font" }} className="text-gray-500 mt-2">
                No Thumbnail Selected, Select a thumbnail
              </Text>
            </View>
          )}
          </Pressable>
          
          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            className={`${
              isSubmitting ? "bg-gray-300" : "bg-orange-500"
            } rounded-full p-4`}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                style={{ fontFamily: "Font" }}
                className="text-center text-white text-lg"
              >
                Create Course
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default CreateCourse;
