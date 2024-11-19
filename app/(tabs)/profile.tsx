import React, { useState, useEffect } from "react";
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
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import { Course, User } from "@/types/types";

export default function Profile() {
  const { user, setUser } = useAuthStore(); 
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [profilePic, setProfilePic] = useState(user?.profilePic || null);
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `http://192.168.0.104:5000/api/users/${user?._id}/courses`
        );
        setCourses(response.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, [user]);

  const handleImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("fullName", fullName);
      formData.append("email", email);

      if (profilePic && profilePic !== user?.profilePic) {
        const fileName = profilePic.split("/").pop();
        const type = `image/${fileName?.split(".").pop()}`;
        formData.append("profilePic", {
          uri: profilePic,
          name: fileName,
          type,
        } as any);
      }

      const response = await axios.put(
        `http://192.168.0.104:5000/api/users/${user?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setUser(response.data);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1">
      <View className="p-6">
        {/* Profile Header */}
        <View className="items-center flex-row mb-6 mt-8 gap-8">
          <TouchableOpacity onPress={handleImagePicker}>
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : require("@/assets/images/students.png")
              }
              className="w-40 h-40 rounded-2xl border-4 border-orange-500"
            />
          </TouchableOpacity>
          <View>
          <Text style={{fontFamily:"Font"}} className=" mt-3 text-2xl text-orange-500">
            {user?.fullName || "Your Name"}
          </Text>
          <Text style={{fontFamily:"Font"}} className="text-gray-600 text-sm">{user?.email}</Text>
          </View>
        </View>

        {/* Profile Form */}
        <View className=" rounded-lg p-5 ">
          <Text style={{fontFamily:"Font"}}  className="text-gray-700 mb-2 text-xs">Full Name</Text>
          <TextInput style={{fontFamily:"Font"}} 
            value={fullName}
            onChangeText={setFullName}
            className="border border-gray-300 rounded-lg p-3 mb-4 text-xl"
          />

          <Text style={{fontFamily:"Font"}} className="text-gray-700 mb-2 text-xs">Email</Text>
          <TextInput
            value={email} style={{fontFamily:"Font"}} 
            onChangeText={setEmail}
            className="border border-gray-300 rounded-2xl p-3 mb-4 text-xl"
            keyboardType="email-address"
          />

          <TouchableOpacity
            onPress={handleProfileUpdate}
            className={`p-4 rounded-2xl ${loading ? "bg-gray-500" : "bg-orange-500"} `}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={{fontFamily:"Font"}}  className="text-white text-center ">
                Update Profile
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Enrolled Courses */}
        <View className="mt-6">
          <Text style={{fontFamily:"Font"}}  className="text-gray-800 text-xl font-bold mb-4">
            Enrolled Courses
          </Text>
          {courses.length > 0 ? (
            courses.map((course) => (
              <View
                key={course?._id}
                className="bg-white p-4 rounded-lg shadow-md mb-4 border-l-4 border-orange-500"
              >
                <Text style={{fontFamily:"Font"}}  className="text-gray-900 font-semibold text-lg">
                  {course?.title}
                </Text>
                <Text style={{fontFamily:"Font"}}  className="text-gray-600 text-sm mt-1">
                  {course?.description}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{fontFamily:"Font"}}  className="text-gray-600 text-base">
              You are not enrolled in any courses.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
