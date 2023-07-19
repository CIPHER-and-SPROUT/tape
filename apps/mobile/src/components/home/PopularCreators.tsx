import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import * as Animatable from 'react-native-animatable'

import haptic from '~/helpers/haptic'
import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

import AnimatedPressable from '../ui/AnimatedPressable'

const BORDER_RADIUS = 25

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    marginHorizontal: 5
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    marginRight: 6
  },
  title: {
    fontFamily: 'font-bold',
    color: theme.colors.white,
    fontSize: normalizeFont(14)
  },
  subheading: {
    fontFamily: 'font-normal',
    color: theme.colors.secondary,
    fontSize: normalizeFont(12)
  },
  image: {
    width: 120,
    height: 120
  }
})

const PopularCreators = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trending on Lensverse</Text>
      <Text style={styles.subheading}>Discover, Connect, and Collect</Text>
      <Animatable.View
        useNativeDriver
        animation={{
          0: {
            opacity: 0,
            translateX: 50
          },
          1: {
            opacity: 1,
            translateX: 0
          }
        }}
        delay={300}
      >
        <ScrollView
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          style={{
            paddingTop: 20
          }}
        >
          <AnimatedPressable
            onPress={() => haptic()}
            style={styles.imageContainer}
          >
            <ExpoImage
              source={{
                uri: 'https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/c056a6a8231af2a3985540809355e94b17b01afbc9327354004740f8807b884c.jpg'
              }}
              style={styles.image}
            />
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => haptic()}
            style={styles.imageContainer}
          >
            <ExpoImage
              source={{
                uri: 'https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/efd58c57f453b95877ff28acdca13f0bc60b3f1090bacfd903d3b8d1e1f02171.jpg'
              }}
              style={styles.image}
            />
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => haptic()}
            style={styles.imageContainer}
          >
            <ExpoImage
              source={{
                uri: 'https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/1cd054f79aa6d0b3f82f69ee4b5ea4d5bec8ac822c1543824b9b54f624a94caf.jpg'
              }}
              style={styles.image}
            />
          </AnimatedPressable>
          <AnimatedPressable
            onPress={() => haptic()}
            style={styles.imageContainer}
          >
            <ExpoImage
              source={{
                uri: 'https://ik.imagekit.io/lens/media-snapshot/tr:w-300,h-300/5e4de29b5e6a5be5138495e03e8c766e7e66b67f37d1d028e8a1bdaf5bc61ffb.png'
              }}
              style={styles.image}
            />
          </AnimatedPressable>
        </ScrollView>
      </Animatable.View>
    </View>
  )
}

export default PopularCreators
