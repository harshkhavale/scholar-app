import { View, Text, Module } from "react-native";
import React from "react";
import { Modules, Reviews } from "@/types/types";
import ModuleCard from "./ModuleCard";
import ReviewCard from "./ReviewCard";
interface ReviewListProps {
  ReviewsData: Reviews | undefined;
  isLoading: boolean;
  onLoadMore: () => void;
}
const ReviewList: React.FC<ReviewListProps> = ({
  ReviewsData,
  isLoading,
  onLoadMore,
}) => {
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
                <ReviewCard review={review}/>
              </View>))
            }
            </View>
        </View>
      )}
    </View>
  );
};

export default ReviewList;
