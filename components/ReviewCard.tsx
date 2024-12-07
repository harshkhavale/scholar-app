import { Review } from "@/types/types";
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

interface ReviewCardProps {
  review: Review
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <TouchableOpacity className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4">
      {/* User Information */}
      <View className="flex-row items-center mb-2">
       
        <Image
        source={
            review.userId.profilePic
              ? { uri: review.userId.profilePic }
              : require("@/assets/images/placeholder.png")
          }
          className="w-10 h-10 rounded-sm mr-3"
          style={{ resizeMode: "cover" }}
        />
        <View className=" flex-col">
        <Text style={{ fontFamily: "Font" }} className="text-xs font-semibold text-gray-800">
          {review.userId.fullName}
        </Text>
        <Text style={{ fontFamily: "Font" }} className="text-xs text-gray-500 mt-2">
        Posted on {new Date(review.createdAt).toLocaleDateString()}
      </Text>
        </View>
       
      </View>

      {/* Review Text */}
      <Text style={{ fontFamily: "Font" }} className="text-sm text-gray-600">
        {review.reviewText}
      </Text>

     
    </TouchableOpacity>
  );
};

export default ReviewCard;
