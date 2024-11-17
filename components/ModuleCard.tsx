import { Module } from '@/types/types';
import React from 'react';
import { View, Text, TouchableOpacity, Linking, Platform} from 'react-native';


interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  const handleFileOpen = (filePath: string) => {
    const fileUrl = `https://your-api-url.com/uploads/resources/${filePath}`;
    if (Platform.OS === 'android') {
      Linking.openURL(fileUrl); // Open file URL
    } else {
      Linking.openURL(fileUrl);
    }
  };

  return (
    <View className="bg-white p-4 rounded-lg shadow-md mb-4">
      <Text className="text-xl font-semibold text-gray-800">{module.title}</Text>
      <Text className="text-base text-gray-600 mt-2">{module.description}</Text>

      <View className="mt-4">
        {/* Doc Resource */}
        {module.resources?.doc && (
          <TouchableOpacity
            className="bg-blue-500 p-2 rounded-lg mb-2"
            // onPress={() => handleFileOpen(module.resources.doc)}
          >
            <Text className="text-white text-center">Open Document</Text>
          </TouchableOpacity>
        )}

        {/* Video Resource */}
        {module.resources?.video && (
          <TouchableOpacity
            className="bg-green-500 p-2 rounded-lg"
            // onPress={() => handleFileOpen(module.resources.video)}
          >
            <Text className="text-white text-center">Watch Video</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ModuleCard;
