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
import axios from "axios";
import { useAuthStore } from "@/store/auth-store";
import { Course } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/utils/endpoints";
import { router } from "expo-router";

export default function EducatorProfile() {
  const user = useAuthStore((state) => state.user);

  const [educatorData, setEducatorData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [bannerPic, setBannerPic] = useState<string | null>(null);

  const fetchCourses = async (): Promise<Course[]> => {
    try {
      const response = await axios.get(
        `${BASE_URL}/api/courses`
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
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["fetch-courses"],
    queryFn: () => fetchCourses(),
    enabled: true,
  });
  useEffect(() => {
    const fetchEducatorData = async () => {
      try {
        console.log(user);
        const response = await axios.get(
          `${BASE_URL}/api/educators/user/${user?.id}`
        );
        setEducatorData(response.data);
        setBannerPic(`${BASE_URL}/uploads/thumbnails/${response.data.banner_image}`);
        console.log(`${BASE_URL}/uploads/thumbnails/${response.data.banner_image}`);
        setProfilePic(`${BASE_URL}/uploads/thumbnails/${response.data.profile_image}`);
      } catch (error) {
        console.error("Error fetching educator data:", error);
      }
    };

    fetchEducatorData();
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
      aspect: [1, 1],
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

      if (profilePic && profilePic !== educatorData.profile_image) {
        const fileName = profilePic.split("/").pop();
        const type = `image/${fileName?.split(".").pop()}`;
        formData.append("profile_image", {
          uri: profilePic,
          name: fileName,
          type,
        } as any);
      }
      if (bannerPic && bannerPic !== educatorData.banner_image) {
        const fileName = bannerPic.split("/").pop();
        const type = `image/${fileName?.split(".").pop()}`;
        formData.append("banner_image", {
          uri: bannerPic,
          name: fileName,
          type,
        } as any);
      }

      // Append other educator data
      formData.append("description", educatorData.description);
      formData.append("contact_email", educatorData.contact_email);
      formData.append(
        "qualifications",
        JSON.stringify(educatorData.qualifications)
      );
      formData.append(
        "social_links",
        JSON.stringify(educatorData.social_links)
      );
      formData.append("specialties", JSON.stringify(educatorData.specialties));

      const response = await axios.put(
        `${BASE_URL}/api/educators/${user?._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        alert("Educator profile updated successfully!");
        setEducatorData(response.data);
      }
    } catch (error) {
      console.error("Error updating educator profile:", error);
      alert("Failed to update educator profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!educatorData) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FFA500" />
      </View>
    );
  }
  return (
    <ScrollView className="flex-1">
      <View className=" relative">
       {
        user?.userType === "educator" && (

          <TouchableOpacity onPress={handleBannerImagePicker} className=" mb-20">
          <Image
            source={
              profilePic
                ? { uri: bannerPic }
                : require("@/assets/images/placeholder.png")
            }
            className="w-full h-48 object-cover"
          />{" "}
        </TouchableOpacity>
        )
       }

        <View className={`${user?.userType === "educator" ? "absolute top-24 left-6":" p-6"}`}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image
              source={
                profilePic
                  ? { uri: profilePic }
                  : require("@/assets/images/placeholder.png")
              }
              className="w-40 h-40 rounded-lg object-cover border-4 border-orange-500"
            />
          </TouchableOpacity>
        </View>
        <View className=" px-8">
          {/* FullName */}
          <View className="mb-4">
            <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2">
              Full Name
            </Text>
            <TextInput
              style={{ fontFamily: "Font" }}
              value={educatorData.fullName || ""}
              onChangeText={(text) =>
                setEducatorData((prev: any) => ({ ...prev, fullName: text }))
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
              value={educatorData.contact_email || ""}
              onChangeText={(text) =>
                setEducatorData((prev: any) => ({
                  ...prev,
                  contact_email: text,
                }))
              }
              className="border border-gray-300 rounded-lg p-3 text-lg"
            />
          </View>



         {
          user?.userType === "educator" && (
            <View>
             {/* Description */}
          <View className="mb-4">
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2">
            Description
          </Text>
          <TextInput
            style={{ fontFamily: "Font" }}
            value={educatorData.description || ""}
            onChangeText={(text) =>
              setEducatorData((prev: any) => ({ ...prev, description: text }))
            }
            className="border border-gray-300 rounded-lg p-3 text-lg"
            multiline
          />
        </View>
        {/* Qualifications */}
        <View className="mb-4">
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2">
            Qualifications
          </Text>
          <TextInput
            style={{ fontFamily: "Font" }}
            value={educatorData.qualifications?.degree || ""}
            onChangeText={(text) =>
              setEducatorData((prev: any) => ({
                ...prev,
                qualifications: { ...prev.qualifications, degree: text },
              }))
            }
            placeholder="Degree"
            className="border border-gray-300 rounded-lg p-3 text-lg mb-2"
          />
          <TextInput
            style={{ fontFamily: "Font" }}
            value={educatorData.qualifications?.institution || ""}
            onChangeText={(text) =>
              setEducatorData((prev: any) => ({
                ...prev,
                qualifications: { ...prev.qualifications, institution: text },
              }))
            }
            placeholder="Institution"
            className="border border-gray-300 rounded-lg p-3 text-lg mb-2"
          />
          <TextInput
            style={{ fontFamily: "Font" }}
            value={educatorData.qualifications?.year?.toString() || ""}
            onChangeText={(text) =>
              setEducatorData((prev: any) => ({
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
          <Text style={{ fontFamily: "Font" }} className="text-gray-700 mb-2">
            Social Links
          </Text>
          <TextInput
            style={{ fontFamily: "Font" }}
            value={educatorData.social_links?.linkedin || ""}
            onChangeText={(text) =>
              setEducatorData((prev: any) => ({
                ...prev,
                social_links: { ...prev.social_links, linkedin: text },
              }))
            }
            placeholder="LinkedIn"
            className="border border-gray-300 rounded-lg p-3 text-lg mb-2"
          />
          <TextInput
            style={{ fontFamily: "Font" }}
            value={educatorData.social_links?.twitter || ""}
            onChangeText={(text) =>
              setEducatorData((prev: any) => ({
                ...prev,
                social_links: { ...prev.social_links, twitter: text },
              }))
            }
            placeholder="Twitter"
            className="border border-gray-300 rounded-lg p-3 text-lg mb-2"
          />
          <TextInput
            style={{ fontFamily: "Font" }}
            value={educatorData.social_links?.website || ""}
            onChangeText={(text) =>
              setEducatorData((prev: any) => ({
                ...prev,
                social_links: { ...prev.social_links, website: text },
              }))
            }
            placeholder="Website"
            className="border border-gray-300 rounded-lg p-3 text-lg"
          />
        </View>
</View>
          )
         }
          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            className={`p-4 rounded-2xl ${
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
            className="text-gray-800 text-xl font-bold mb-4 px-4"
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
                <View className=" flex-row items-center overflow-hidden relative bg-white mx-8 rounded-lg shadow-md mb-4 border-l-4 border-green-500">
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
                      className="text-gray-600 text-sm mt-1"
                    >
                      {course?.description}
                    </Text>
                  </View>
                  <View>
                    <Image
                      source={{
                        uri: `${BASE_URL}/uploads/thumbnails/${course.thumbnail}`,
                      }}
                      className=" w-20 h-24"
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
