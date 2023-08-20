import Ionicons from '@expo/vector-icons/Ionicons'
import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import { TimelineFeedType } from '@lenstube/lens/custom-types'
import { useNavigation } from '@react-navigation/native'
import { Image as ExpoImage } from 'expo-image'
import type { Dispatch, FC } from 'react'
import React from 'react'
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'
import useMobileStore from '~/store'

import { useToast } from '../common/toast'

const styles = StyleSheet.create({
  container: {
    marginVertical: 30
  },
  filter: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 25
  },
  text: {
    fontFamily: 'font-bold',
    fontSize: normalizeFont(12)
  },
  image: {
    width: 20,
    height: 20
  }
})

type Props = {
  selectedFeedType: TimelineFeedType
  setSelectedFeedType: Dispatch<TimelineFeedType>
}

const TimelineFilters: FC<Props> = ({
  selectedFeedType,
  setSelectedFeedType
}) => {
  const { navigate } = useNavigation()
  const { showToast } = useToast()
  const selectedChannel = useMobileStore((state) => state.selectedChannel)

  return (
    <ScrollView
      style={styles.container}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 5, paddingRight: 15 }}
    >
      <Pressable
        onPress={() => setSelectedFeedType(TimelineFeedType.CURATED)}
        style={[
          styles.filter,
          {
            backgroundColor:
              selectedFeedType === TimelineFeedType.CURATED
                ? theme.colors.white
                : 'transparent'
          }
        ]}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/in-love.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text
          style={[
            styles.text,
            {
              color:
                selectedFeedType === TimelineFeedType.CURATED
                  ? theme.colors.black
                  : theme.colors.white
            }
          ]}
        >
          Curated
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          if (!selectedChannel) {
            return showToast({ text: 'Sign in with Lens' })
          }
          setSelectedFeedType(TimelineFeedType.FOLLOWING)
        }}
        style={[
          styles.filter,
          {
            backgroundColor:
              selectedFeedType === TimelineFeedType.FOLLOWING
                ? theme.colors.white
                : 'transparent'
          }
        ]}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/smile.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text
          style={[
            styles.text,
            {
              color:
                selectedFeedType === TimelineFeedType.FOLLOWING
                  ? theme.colors.black
                  : theme.colors.white
            }
          ]}
        >
          Following
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          if (!selectedChannel) {
            return showToast({ text: 'Sign in with Lens' })
          }
          setSelectedFeedType(TimelineFeedType.HIGHLIGHTS)
        }}
        style={[
          styles.filter,
          {
            backgroundColor:
              selectedFeedType === TimelineFeedType.HIGHLIGHTS
                ? theme.colors.white
                : 'transparent'
          }
        ]}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/wow.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text
          style={[
            styles.text,
            {
              color:
                selectedFeedType === TimelineFeedType.HIGHLIGHTS
                  ? theme.colors.black
                  : theme.colors.white
            }
          ]}
        >
          Highlights
        </Text>
      </Pressable>
      <Pressable
        onPress={() => {
          navigate('FeedFlexModal')
          setSelectedFeedType(TimelineFeedType.ALGORITHM)
        }}
        style={[
          styles.filter,
          {
            backgroundColor:
              selectedFeedType === TimelineFeedType.ALGORITHM
                ? theme.colors.white
                : 'transparent'
          }
        ]}
      >
        <ExpoImage
          source={{
            uri: imageCdn(`${STATIC_ASSETS}/mobile/icons/proud.png`, 'AVATAR')
          }}
          style={styles.image}
        />
        <Text
          style={[
            styles.text,
            {
              color:
                selectedFeedType === TimelineFeedType.ALGORITHM
                  ? theme.colors.black
                  : theme.colors.white
            }
          ]}
        >
          Flex
        </Text>
        <Ionicons
          name="chevron-down-outline"
          color={
            selectedFeedType === TimelineFeedType.ALGORITHM
              ? theme.colors.black
              : theme.colors.white
          }
          size={15}
        />
      </Pressable>
    </ScrollView>
  )
}

export default TimelineFilters
