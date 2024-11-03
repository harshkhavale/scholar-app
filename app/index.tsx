import { useRef, useEffect } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import LottieView from 'lottie-react-native';
import {schoolboy, schoolgirl} from '../assets';
import "../global.css"
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import Button from '@/components/Button';
import {router} from "expo-router";
export default function App() {
 
  return (
    <View className='gap-4 flex-1 w-full justify-center items-center happy'>
      <Animated.View entering={FadeInDown.duration(300).springify()} className='w-full flex justify-center ps-8 items-center'>
     <Image source={schoolgirl} className=' h-80 w-80 object-contain'/>
     </Animated.View>
     <Animated.View entering={FadeInDown.duration(300).delay(200).springify()} className='w-full'>
      <Text style={{fontFamily:"Font"}} className='text-5xl text-center leading-[3.5rem]'>
        Discover and improve your skills.
      </Text>
     </Animated.View>
     <Animated.View entering={FadeInDown.duration(300).delay(400).springify()} className='w-full'>
      <Text style={{fontFamily:"Font"}} className='text-center leading-[3.5rem]'>
        Learn from the best courses and tutorials!
      </Text>
     </Animated.View>
     <Animated.View entering={FadeInDown.duration(300).delay(600).springify()} className='w-full flex justify-center items-center'>
      <Button title='Get Started' action={()=>router.push("/(tabs)")}/>
     </Animated.View>
    </View>
  );
}


