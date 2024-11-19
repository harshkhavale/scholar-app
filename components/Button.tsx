import { View, Text, Pressable } from 'react-native';
import React from 'react';
import "../global.css";

interface ButtonProps {
  title: string;
  action?: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, action }: ButtonProps) => {
  return (
    <View className="w-full flex justify-center items-center">
      <Pressable
        className="bg-orange-500 rounded-3xl justify-center items-center py-5 w-3/4"
        onPress={action}
      >
        <Text
          style={{ fontFamily: "Font", fontSize: 18, fontWeight: 'bold', color: 'white' }}
        >
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

export default Button;
