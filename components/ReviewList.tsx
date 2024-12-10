import React, { useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import ReviewCard from "./ReviewCard";
import { Reviews } from "@/types/types";
import { useAuthStore } from "@/store/auth-store";
import axios from "axios";
import { BASE_URL } from "@/utils/endpoints";

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
  courseId,
}) => {
  const [review, setReview] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const { user } = useAuthStore.getState();

  const handlePostReview = async () => {
    if (!review.trim()) {
      Alert.alert("Error", "Review cannot be empty!");
      return;
    }

    if (!user?.id) {
      Alert.alert("Error", "User not logged in.");
      return;
    }

    setIsPosting(true);

    try {
      const response = await axios.post(`${BASE_URL}/api/reviews`, {
        courseId,
        userId: user.id,
        reviewText: review.trim(),
      },{
        headers:{
          "Cache-Control": "no-cache"
        }
      });

      if (response.status === 201) {
        Alert.alert("Success", "Review posted successfully!");
        setReview(""); // Clear the input field
        onLoadMore(); // Call the `onLoadMore` function to refresh the reviews
      } else {
        Alert.alert("Error", "Failed to post review.");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "An unexpected error occurred.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <View>
      {ReviewsData?.total === 0 ? (
        <Text style={{ fontFamily: "Font" }}>No Reviews yet...</Text>
      ) : (
        <View>
          <Text style={{ fontFamily: "Font" }} className=" text-2xl mb-8">
            Reviews: {ReviewsData?.total}
          </Text>
          <View>
            {ReviewsData?.data.map((review, index) => (
              <View key={index}>
                <ReviewCard review={review} />
              </View>
            ))}
          </View>
        </View>
      )}
      {user?.enrolls?.includes(courseId) && (
        <View>
          <TextInput
            value={review}
            onChangeText={setReview}
            style={{ fontFamily: "Font" }}
            
            placeholder="Comment here..."
            className="border-2 border-gray-200 w-full rounded-2xl text-xl p-4"
            multiline
          />
          <Pressable
            onPress={handlePostReview}
            disabled={isPosting}
            className="py-4 w-min"
          >
            <Text
              style={{ fontFamily: "Font" }}
              className="bg-orange-500 w-min text-white text-xl text-center rounded-2xl p-2"
            >
              {isPosting ? "Posting..." : "Post Review"}
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default ReviewList;
