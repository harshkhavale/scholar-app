import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import { BASE_URL } from "@/utils/endpoints";
import Toast from "react-native-toast-message";

const CreateCourse = () => {
  const { user } = useAuthStore(); // Assuming the logged-in user is the educator
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [price, setPrice] = useState<string>("");
  const [languages, setLanguages] = useState<string>("");
  const [topics, setTopics] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const showToast = (type: "success" | "error", text1: string, text2?: string) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "top",
    });
  };

  const handleImagePicker = async (): Promise<void> => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setThumbnail(result.assets[0].uri);
      showToast("success", "Image Selected", "Thumbnail updated successfully.");
    }
  };

  const handleCreateCourse = async (): Promise<void> => {
    if (!title.trim()) {
      showToast("error", "Course Title is required", "Please enter a title for your course.");
      return;
    }

    if (!description.trim()) {
      showToast("error", "Course Description is required", "Please provide a description.");
      return;
    }

    if (!thumbnail) {
      showToast("error", "Course Thumbnail is required", "Please select a thumbnail.");
      return;
    }

    if (price && isNaN(Number(price))) {
      showToast("error", "Invalid Price", "Price must be a valid number.");
      return;
    }

    if (!languages.trim()) {
      showToast("error", "Languages are required", "Specify at least one language.");
      return;
    }

    if (!topics.trim()) {
      showToast("error", "Topics are required", "Specify at least one topic for your course.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("price", price || "");
      formData.append("educator", user?.id || ""); // Replace with actual user ID
      formData.append("languages", JSON.stringify(languages.split(",").map((lang) => lang.trim())));
      formData.append("topics", JSON.stringify(topics.split(",").map((topic) => topic.trim())));

      if (thumbnail) {
        const fileName = thumbnail.split("/").pop() || "thumbnail.jpg";
        const type = `image/${fileName.split(".").pop()}`;
        formData.append("thumbnail", {
          uri: thumbnail,
          name: fileName,
          type,
        } as unknown as Blob);
      }

      const response = await axios.post(`${BASE_URL}/api/courses`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        showToast("success", "Course created successfully!", "Now add modules to your course.");
      }
    } catch (error) {
      console.error("Error creating course:", error);
      showToast("error", "Failed to create course!", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <View className="">
        

        <ScrollView className="rounded-lg h-[80vh] p-4">
          {/* Title */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Course Title
          </Text>
          <TextInput
            style={{ fontFamily: "Font" }}
            value={title}
            focusable
            onChangeText={(text)=>setTitle(text)}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
          />

          {/* Description */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Course Description
          </Text>
          <TextInput
            style={{
              fontFamily: "Font",
              height: 150,
              textAlignVertical: "top",
            }}
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
                  : require("@/assets/images/placeholder.png")
              }
              className="w-full h-36 object-cover rounded-lg border border-gray-300 bg-gray-100"
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Price */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Price (Optional)
          </Text>
          <TextInput
            style={{ fontFamily: "Font" }}
            value={price}
            onChangeText={setPrice}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
            keyboardType="numeric"
          />

          {/* Languages */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Languages (comma-separated)
          </Text>
          <TextInput
            style={{ fontFamily: "Font" }}
            value={languages}
            onChangeText={setLanguages}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
          />

          {/* Topics */}
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2 text-xs">
            Topics (comma-separated)
          </Text>
          <TextInput
            style={{ fontFamily: "Font" }}
            value={topics}
            onChangeText={setTopics}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
          />

          
        </ScrollView>
        <TouchableOpacity
            onPress={handleCreateCourse}
            className={`p-4 m-4 rounded-2xl ${
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
          <Toast/>
      </View>
    </View>
  );
};

export default CreateCourse;
