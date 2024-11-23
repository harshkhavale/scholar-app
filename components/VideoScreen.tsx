import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { StyleSheet, View, Button } from 'react-native';


interface VideoScreenProps{
    videoSource: string;
}
const VideoScreen:React.FC<VideoScreenProps> =({videoSource}) =>{
  const player = useVideoPlayer(videoSource, player => {
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  return (
    <View style={styles.contentContainer}>
      <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture />
      
    </View>
  );
}
export default VideoScreen;

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 50,
  },
  video: {
    width: 380,
    height: 230,
  },
  controlsContainer: {
    padding: 10,
  },
});
