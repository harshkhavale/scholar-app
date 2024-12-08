import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Image
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import { Course } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/utils/endpoints";
import { router } from "expo-router";

export default function EducatorProfile() {
  const user = useAuthStore((state) => state.user);

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bannerPic, setBannerPic] = useState<string | null>(null);

  const fetchCourses = async (): Promise<Course[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/users/${user?.id}/enrolls`
        //   , {
        //   params: { search: searchTerm },
        //   headers: {
        //     Authorization: `Bearer ${Constants.extra?.token}`,
        //   },
        // }
      );
      return response.data.enrolledCourses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw error;
    }
  };
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["fetch-courses"],
    queryFn: () => fetchCourses(),
    enabled: true,
  });
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log(user);
        if (user?.userType === "educator") {
          const response = await axios.get(
            `${BASE_URL}/api/educators/user/${user?.id}`
          );
          setUserData(response.data);
          
        } else {
          const response = await axios.get(`${BASE_URL}/api/users/${user?.id}`);
          setUserData(response.data);
         
          
        }
      } catch (error) {
        console.error("Error fetching educator data:", error);
      }
    };

    fetchUserData();
  }, [user?._id]);

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
  const handleBannerImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [2, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setBannerPic(result.assets[0].uri);
    }
  };
  const handleSave = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
  
      // Profile Image
      if (profilePic && profilePic !== userData.profile_image) {
        const fileName = profilePic.split("/").pop();
        const type = `image/${fileName?.split(".").pop()}`;
        formData.append("profile_image", {
          uri: profilePic,
          name: fileName,
          type,
        } as any);
      }
  
      // Banner Image (Educators only)
      if (user?.userType === "educator" && bannerPic && bannerPic !== userData.banner_image) {
        const fileName = bannerPic.split("/").pop();
        const type = `image/${fileName?.split(".").pop()}`;
        formData.append("background_image", {
          uri: bannerPic,
          name: fileName,
          type,
        } as any);
      }
  
      // Add common fields
      formData.append("fullName", userData.fullName);
      formData.append("email", userData.email);
  
      // Password (if changed)
      if (userData.password) {
        formData.append("password", userData.password);
      }
  
      // Educator-specific fields
      if (user?.userType === "educator") {
        formData.append("description", userData.description);
        formData.append("contact_email", userData.contact_email);
        formData.append("qualifications", JSON.stringify(userData.qualifications));
        formData.append("social_links", JSON.stringify(userData.social_links));
        formData.append("specialties", JSON.stringify(userData.specialties));
      }
  
      // API Endpoint based on userType
      const endpoint =
        user?.userType === "educator"
          ? `${BASE_URL}/api/educators/user/${user.id}`
          : `${BASE_URL}/api/users/${user?.id}`;
  
      const response = await axios.put(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
    }
  };
  

  if (!userData) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }
  return (
    <ScrollView className="flex-1 mt-10">
      <View className="relative">
        {user?.userType === "educator" && (
          <View>
            <TouchableOpacity onPress={handleBannerImagePicker} className="mb-20 h-36 bg-orange-500">
  {bannerPic ? (
    <Image
      source={{ uri: bannerPic }}
      style={{ width: "100%", height: 120 }}
      resizeMode="cover"
    />
  ) : (
    <Image
      source={require("@/assets/images/placeholder.png")}
      style={{ width: "100%", height: 54, marginTop:54, marginLeft:150 }}
      resizeMode="contain"
    />
  )}


</TouchableOpacity>

          </View>
        )}

        <View className=" px-8 pt-2">
          <Text
            style={{ fontFamily: "Font" }}
            className="text-2xl text-orange-500 mb-6"
          >
            {user?.userType === "educator"
              ? "Update Educator Profile"
              : "User Profile"}
          </Text>
          <View
            className={`${
              user?.userType === "educator"
                ? "absolute -top-48 left-6 pb-0"
                : " pb-8"
            }`}
          >
            <TouchableOpacity onPress={handleImagePicker}>
              <Image
                source={profilePic || require("@/assets/user.png")}
                style={{
                  width: 140, // w-40 in Tailwind
                  height: 140, // h-40 in Tailwind
                }}
                alt="@/assets/user.png"
                className="bg-orange-500 border-2 border-orange-100 rounded-2xl"
              />
            </TouchableOpacity>
          </View>
          {/* FullName */}
          <View className="mb-4">
            <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2">
              Full Name
            </Text>
            <TextInput
              style={{ fontFamily: "Font" }}
              value={userData.fullName || ""}
              onChangeText={(text) =>
                setUserData((prev: any) => ({ ...prev, fullName: text }))
              }
              className="border border-gray-300 rounded-lg p-3 text-lg"
              multiline
            />
          </View>

          {/* Contact Email */}
          <View className="mb-4">
            <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2">
              Contact Email
            </Text>
            <TextInput
              style={{ fontFamily: "Font" }}
              value={userData.contact_email ||userData.email || ""}
              onChangeText={(text) =>
                setUserData((prev: any) => ({
                  ...prev,
                  contact_email: text,
                }))
              }
              className="border border-gray-300 rounded-lg p-3 text-lg"
            />
          </View>

          {user?.userType === "educator" && (
            <View>
              {/* Description */}
              <View className="mb-4">
                <Text
                  style={{ fontFamily: "Font" }}
                  className="text-gray-700 mb-2"
                >
                  Description
                </Text>
                <TextInput
                  style={{ fontFamily: "Font" }}
                  value={userData.description || ""}
                  onChangeText={(text) =>
                    setUserData((prev: any) => ({
                      ...prev,
                      description: text,
                    }))
                  }
                  className="border border-gray-300 rounded-lg p-3 text-lg"
                  multiline
                />
              </View>
              {/* Qualifications */}
              <View className="mb-4">
                <Text
                  style={{ fontFamily: "Font" }}
                  className="text-gray-700 mb-2"
                >
                  Qualifications
                </Text>
                <TextInput
                  style={{ fontFamily: "Font" }}
                  value={userData.qualifications?.degree || ""}
                  onChangeText={(text) =>
                    setUserData((prev: any) => ({
                      ...prev,
                      qualifications: { ...prev.qualifications, degree: text },
                    }))
                  }
                  placeholder="Degree"
                  className="border border-gray-300 rounded-lg p-3 text-lg mb-2"
                />
                <TextInput
                  style={{ fontFamily: "Font" }}
                  value={userData.qualifications?.institution || ""}
                  onChangeText={(text) =>
                    setUserData((prev: any) => ({
                      ...prev,
                      qualifications: {
                        ...prev.qualifications,
                        institution: text,
                      },
                    }))
                  }
                  placeholder="Institution"
                  className="border border-gray-300 rounded-lg p-3 text-lg mb-2"
                />
                <TextInput
                  style={{ fontFamily: "Font" }}
                  value={userData.qualifications?.year?.toString() || ""}
                  onChangeText={(text) =>
                    setUserData((prev: any) => ({
                      ...prev,
                      qualifications: {
                        ...prev.qualifications,
                        year: Number(text),
                      },
                    }))
                  }
                  placeholder="Year"
                  className="border border-gray-300 rounded-lg p-3 text-lg"
                  keyboardType="numeric"
                />
              </View>

              {/* Social Links */}
              <View className="mb-4">
                <Text
                  style={{ fontFamily: "Font" }}
                  className="text-gray-700 mb-2"
                >
                  Social Links
                </Text>
                <TextInput
                  style={{ fontFamily: "Font" }}
                  value={userData.social_links?.linkedin || ""}
                  onChangeText={(text) =>
                    setUserData((prev: any) => ({
                      ...prev,
                      social_links: { ...prev.social_links, linkedin: text },
                    }))
                  }
                  placeholder="LinkedIn"
                  className="border border-gray-300 rounded-lg p-3 text-lg mb-2"
                />
                <TextInput
                  style={{ fontFamily: "Font" }}
                  value={userData.social_links?.twitter || ""}
                  onChangeText={(text) =>
                    setUserData((prev: any) => ({
                      ...prev,
                      social_links: { ...prev.social_links, twitter: text },
                    }))
                  }
                  placeholder="Twitter"
                  className="border border-gray-300 rounded-lg p-3 text-lg mb-2"
                />
                <TextInput
                  style={{ fontFamily: "Font" }}
                  value={userData.social_links?.website || ""}
                  onChangeText={(text) =>
                    setUserData((prev: any) => ({
                      ...prev,
                      social_links: { ...prev.social_links, website: text },
                    }))
                  }
                  placeholder="Website"
                  className="border border-gray-300 rounded-lg p-3 text-lg"
                />
              </View>
            </View>
          )}
          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className={`p-4 mb-8 rounded-2xl ${
              loading ? "bg-gray-500" : "bg-orange-500"
            }`}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text
                style={{ fontFamily: "Font" }}
                className="text-white text-center"
              >
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>{" "}
      {user?.userType === "student" && (
        <View className="mt-6">
          <Text
            style={{ fontFamily: "Font" }}
            className="text-gray-800 text-xl mb-4 px-4"
          >
            Enrolled Courses
          </Text>
          {data &&
            data?.map((course) => (
              <TouchableOpacity
                key={course?._id}
                onPress={() =>
                  router.push({
                    pathname: "/course-detail",
                    params: { courseId: course._id },
                  })
                }
              >
                <View className=" flex-row items-center overflow-hidden relative bg-white mx-8 rounded-lg shadow-md mb-4 border-l-8 border-green-500">
                  <View className="flex-1 px-4">
                    {" "}
                    <Text
                      style={{ fontFamily: "Font" }}
                      className="text-gray-900 font-semibold text-lg"
                    >
                      {course?.title}
                    </Text>
                    <Text
                      style={{ fontFamily: "Font" }}
                      className="text-gray-600 text-sm mt-1 h-12 truncate"
                    >
                      {course?.description}
                    </Text>
                  </View>
                  <View>
                  <Image
          source={{
            uri: `${BASE_URL}/uploads/thumbnails/${course?.thumbnail}`,
          }}
          className="h-24 w-24 object-cover"
          resizeMode="cover"
        />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          {!data && (
            <Text
              style={{ fontFamily: "Font" }}
              className="text-gray-600 text-base"
            >
              You are not enrolled in any courses.
            </Text>
          )}
        </View>
      )}
    </ScrollView>
  );
}
