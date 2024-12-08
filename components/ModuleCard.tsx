import { Module } from "@/types/types";
import { router } from "expo-router";
import React from "react";
import { View, Text, Linking, Platform, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <TouchableOpacity
    
      className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4"
    >
      {/* Module Title */}\
      <View className="flex-row items-center gap-8">
        <View>
          <Text
            style={{ fontFamily: "Font" }}
            className="text-base font-semibold text-gray-800"
          >
            {module.title}
          </Text>
          {/* Module Description */}
          <Text className="text-xs" style={{ fontFamily: "Font" }}>
            course last updated on{" "}
            {new Date(module?.updatedAt).toLocaleDateString()}
          </Text>
        </View>
        <View className="">
          {" "}
          <AntDesign name="down" size={20} color="black" />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ModuleCard;
