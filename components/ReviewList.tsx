import { View, Text, Module, TextInput, Pressable } from "react-native";
import React, { useState } from "react";
import { Modules, Reviews } from "@/types/types";
import ModuleCard from "./ModuleCard";
import ReviewCard from "./ReviewCard";
import { useAuthStore } from "@/store/auth-store";
interface ReviewListProps {
  ReviewsData: Reviews | undefined;
  isLoading: boolean;
  onLoadMore: () => void;
  courseId: string;
}
const ReviewList: React.FC<ReviewListProps> = ({
  ReviewsData,
  isLoading,
  onLoadMore,
  courseId
}) => {
  const [review, setReview] = useState("");
  const { user, updateUser } = useAuthStore.getState();

  return (
    <View>
      {ReviewsData?.total === 0 ? (
        <Text style={{ fontFamily: "Font" }}>No Reviews yet...</Text>
      ) : (
        <View>
          <Text style={{ fontFamily: "Font" }} className=" text-2xl mb-8">
            Reviews : {ReviewsData?.total}
          </Text>
          <View>
            {ReviewsData?.data.map((review, index) => (
              <View key={index}>
                <ReviewCard review={review} />
              </View>
            ))}
          </View>
          {user?.enrolls?.includes(courseId) && (<View>
            <TextInput
              value={review}
              onChangeText={setReview}
              style={{ fontFamily: "Font" }}
              placeholder="comment here..."
              
              className="border-2 border-gray-200 w-full h-40 rounded-2xl text-xl p-4"
            /> 
            <Pressable className=" py-4 w-min">
              <Text
                style={{ fontFamily: "Font" }}
                className=" bg-orange-500 w-min text-white text-xl text-center rounded-2xl p-2"
              >
                Post Review
              </Text>
            </Pressable>
          </View>) }
          
        </View>
      )}
    </View>
  );
};

export default ReviewList;
