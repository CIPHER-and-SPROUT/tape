import Ionicons from '@expo/vector-icons/Ionicons'
import {
  getPublicationHlsUrl,
  getThumbnailUrl,
  imageCdn
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import { useNavigation } from '@react-navigation/native'
import { ResizeMode, Video } from 'expo-av'
import type { FC } from 'react'
import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { theme } from '~/helpers/theme'

type Props = {
  video: Publication
}

const styles = StyleSheet.create({
  close: {
    position: 'absolute',
    backgroundColor: theme.colors.grey,
    borderRadius: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    right: 5,
    top: 5,
    zIndex: 1
  }
})

const VideoPlayer: FC<Props> = ({ video }) => {
  const { goBack } = useNavigation()

  return (
    <>
      <Video
        usePoster
        shouldPlay
        useNativeControls
        isMuted={false}
        isLooping={false}
        resizeMode={ResizeMode.CONTAIN}
        source={{
          uri: getPublicationHlsUrl(video)
        }}
        posterSource={{ uri: imageCdn(getThumbnailUrl(video, true)) }}
        style={{
          width: '100%',
          aspectRatio: 16 / 9,
          backgroundColor: theme.colors.backdrop
        }}
      />
      <Pressable onPress={() => goBack()} style={styles.close}>
        <Ionicons name="close-outline" color={theme.colors.white} size={25} />
      </Pressable>
    </>
  )
}

export default VideoPlayer
