import { View, Text, Pressable, Image } from "react-native";
import React from "react";
import Animated, { FadeInDown } from "react-native-reanimated";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useWishlistStore } from "@/store/wishlist-store";
import { Course } from "@/types/types";
import { router } from "expo-router";
import { BASE_URL } from "@/utils/endpoints";
interface CourseItemProps {
  course: Course;
  customStyle?: string;
  index: number;
}
const CourseItem: React.FC<CourseItemProps> = ({
  course,
  customStyle,
  index,
}) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();
  const isWishlisted = isInWishlist(course._id);
  const toggleWishlist = ()=>{
    if(isWishlisted){
      removeFromWishlist(course._id);
    }else{
      addToWishlist(course);
    }
  }
  return (
    <Pressable onPress={()=>router.push({pathname:"/course-detail",params:{courseId:course._id}})} className={`pt-4 ${customStyle ? customStyle : ""}`}>
      <Animated.View
        className="gap-2 w-full border border-gray-300 overflow-hidden rounded-2xl"
        entering={FadeInDown.duration(100)
          .delay(index * 300)
          .springify()}
      >
        <Image
          source={{
            uri: `${BASE_URL}/uploads/thumbnails/${course.thumbnail}`,
          }}
          className="w-full h-40"
        />

        <View className="px-4 p-2">
          <Text className=" text-lg font-semibold h-9 text-ellipsis" style={{ fontFamily: "Font" }}>
            {course.title}
          </Text>
          <Text className=" text-sm text-gray-500 truncate text-ellipsis h-12" style={{ fontFamily: "Font" }}>
            {course.description}
          </Text>
          <View className="flex-row items-center pt-2 pb-4 justify-between">
            <Text style={{ fontFamily: "Font" }}>
              {course.price ? `${course.price} ₹` : "Free"}
            </Text>
            <Pressable onPress={toggleWishlist}>
              <Ionicons
                size={24}
                name={isWishlisted ? "heart" : "heart-outline"}
                color={isWishlisted ? "orange" : "gray"}
              />
            </Pressable>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default CourseItem;
