import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import { BASE_URL } from "@/utils/endpoints";



export default function CreateCourse() {
  const { user } = useAuthStore(); // Assuming the logged-in user is the educator
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");
  const [languages, setLanguages] = useState<string>("");
  const [topics, setTopics] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleImagePicker = async (): Promise<void> => {
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

  const handleCreateCourse = async (): Promise<void> => {
    if (!title || !description || !thumbnail) {
      Alert.alert("Error", "Title, description, and thumbnail are required.");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price || "");
      formData.append("educator", user?._id || ""); // Logged-in educator ID
      formData.append(
        "languages",
        JSON.stringify(languages.split(",").map((lang) => lang.trim()))
      );
      formData.append(
        "topics",
        JSON.stringify(topics.split(",").map((topic) => topic.trim()))
      );

      if (thumbnail) {
        const fileName = thumbnail.split("/").pop() || "thumbnail.jpg";
        const type = `image/${fileName.split(".").pop()}`;
        formData.append("thumbnail", {
          uri: thumbnail,
          name: fileName,
          type,
        } as unknown as Blob);
      }

      const response = await axios.post(
        `${BASE_URL}/api/courses`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        Alert.alert("Success", "Course created successfully!");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      Alert.alert("Error", "Failed to create course. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1">
      <View className="p-6">
        <Text style={{ fontFamily: "Font" }} className="text-2xl text-orange-500 mb-6">
          Create a New Course
        </Text>

        <View className="rounded-lg p-5">
          {/* Title */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Course Title
          </Text>
          <TextInput           style={{ fontFamily: "Font" }}

            value={title}
            onChangeText={setTitle}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
          />

          {/* Description */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Course Description
          </Text>
          <TextInput
          style={{ fontFamily: "Font" }}
            value={description}
            onChangeText={setDescription}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
            multiline
          />

          {/* Thumbnail */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Course Thumbnail
          </Text>
          <TouchableOpacity onPress={handleImagePicker} className="mb-4">
            <Image
              source={
                thumbnail
                  ? { uri: thumbnail }
                  : require("@/assets/placeholder.png")
              }
              className="w-full h-32  object-cover rounded-lg border border-gray-300 bg-gray-100"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Price */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Price (Optional)
          </Text>
          <TextInput           style={{ fontFamily: "Font" }}

            value={price}
            onChangeText={setPrice}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
            keyboardType="numeric"
          />
          
          {/* Languages */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Languages (comma-separated)
          </Text>
          <TextInput           style={{ fontFamily: "Font" }}

            value={languages}
            onChangeText={setLanguages}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
          />

          {/* Topics */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Topics (comma-separated)
          </Text>
          <TextInput           style={{ fontFamily: "Font" }}

            value={topics}
            onChangeText={setTopics}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
          />

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleCreateCourse}
            className={`p-4 rounded-2xl ${
              loading ? "bg-gray-500" : "bg-orange-500"
            }`}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={{ fontFamily: "Font" }} className="text-white text-center">
                Create Course
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
