import { Module } from "@/types/types";
import { router } from "expo-router";
import React from "react";
import { View, Text, Linking, Platform, TouchableOpacity } from "react-native";

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
 

  return (
    <TouchableOpacity onPress={()=>router.push({pathname:"/module-detail", params:{moduleId:module._id}})} className="bg-white border-2 border-orange-500 p-4 rounded-lg shadow-sm mb-4">
      {/* Module Title */}
      <Text style={{fontFamily:"Font"}} className="text-xl font-semibold text-gray-800">{module.title}</Text>
      {/* Module Description */}
      <Text style={{fontFamily:"Font"}} className="text-base text-gray-600 mt-2">{module.description}</Text>
      <Text>course last updated on {new Date(module?.updatedAt).toLocaleDateString()}</Text>

      
    </TouchableOpacity>
  );
};

export default ModuleCard;
