import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Animated, { FadeInDown } from 'react-native-reanimated';
interface CourseItemProps{
    course:any;
    customStyle?:string;
    index:number



}
const CourseItem:React.FC<CourseItemProps> = ({course,customStyle,index}) => {
  return (
    <Pressable className={`pt-4 ${customStyle ? customStyle :""}`}>
        <Animated.View className="gap-2 w-full border border-gray-300 overflow-hidden rounded-2xl" entering={FadeInDown.duration(100).delay(index*300).springify()}>
        <View>
      <Text>{course.title}</Text>
    </View>
        </Animated.View>
   </Pressable>
  )
}

export default CourseItem