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
import { LineChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

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

  // Mock data for analytics
  const monthlySalesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [50, 100, 150, 200, 250, 300],
        color: () => `rgba(255, 99, 132, 1)`, // Line color
      },
    ],
  };

  const pieData = [
    {
      name: "Science",
      students: 45,
      color: "#f39c12",
      legendFontColor: "#7f8c8d",
      legendFontSize: 15,
    },
    {
      name: "Maths",
      students: 35,
      color: "#27ae60",
      legendFontColor: "#7f8c8d",
      legendFontSize: 15,
    },
    {
      name: "English",
      students: 20,
      color: "#2980b9",
      legendFontColor: "#7f8c8d",
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      {/* Course Form */}
     

      {/* Analytics Section */}
      <View className="bg-white rounded-lg shadow p-4">
        <Text className="text-lg font-bold mb-4">Analytics</Text>

        {/* Line Chart */}
        <Text className="text-gray-700 mb-2">Monthly Sales</Text>
        <LineChart
          data={monthlySalesData}
          width={Dimensions.get("window").width - 32} // Adjust for padding
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#f7f7f7",
            backgroundGradientTo: "#f7f7f7",
            decimalPlaces: 0,
            color: () => `rgba(255, 99, 132, 1)`,
          }}
          bezier
          style={{
            borderRadius: 8,
          }}
        />

        {/* Pie Chart */}
        <Text className="text-gray-700 mt-8 mb-2">Students by Subject</Text>
        <PieChart
          data={pieData}
          width={Dimensions.get("window").width - 32}
          height={220}
          chartConfig={{
            color: () => `#000`,
          }}
          accessor="students"
          backgroundColor="transparent"
          paddingLeft="15"
        />
      </View>
      <Toast />
    </ScrollView>
  );
};

export default CreateCourse;
