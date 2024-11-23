import { Module } from "@/types/types";
import { router } from "expo-router";
import React from "react";
import { View, Text, Linking, Platform, TouchableOpacity } from "react-native";

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const handleFileOpen = (filePath: string) => {
    const fileUrl = `https://your-api-url.com/uploads/resources/${filePath}`;
    if (Platform.OS === "android") {
      Linking.openURL(fileUrl); // Open file URL for Android
    } else {
      Linking.openURL(fileUrl); // Open file URL for iOS
    }
  };

  return (
    <TouchableOpacity onPress={()=>router.push({pathname:"/module-detail", params:{moduleId:module._id}})} className="bg-white p-4 rounded-lg shadow-md mb-4">
      {/* Module Title */}
      <Text style={{fontFamily:"Font"}} className="text-xl font-semibold text-gray-800">{module.title}</Text>
      {/* Module Description */}
      <Text style={{fontFamily:"Font"}} className="text-base text-gray-600 mt-2">{module.description}</Text>

      
    </TouchableOpacity>
  );
};

export default ModuleCard;
