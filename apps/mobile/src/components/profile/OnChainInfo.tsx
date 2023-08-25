import { STATIC_ASSETS } from '@lenstube/constants'
import { imageCdn } from '@lenstube/generic'
import type { OnChainIdentity } from '@lenstube/lens'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import normalizeFont from '~/helpers/normalize-font'
import { theme } from '~/helpers/theme'

type Props = {
  identity: OnChainIdentity
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: theme.colors.backdrop2,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 10,
    paddingVertical: 1,
    borderColor: theme.colors.grey,
    borderWidth: 1
  },
  image: {
    width: 20,
    height: 20,
    borderRadius: 100,
    backgroundColor: theme.colors.backdrop
  },
  text: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.white
  }
})

const OnChainInfo: FC<Props> = ({ identity }) => {
  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10 }}
    >
      <View style={[styles.badge, { paddingLeft: 10 }]}>
        <Text style={styles.text}>Bloomer since July 2022</Text>
      </View>
      {identity?.ens?.name && (
        <View style={styles.badge}>
          <ExpoImage
            source={{
              uri: imageCdn(
                `${STATIC_ASSETS}/mobile/images/products/ens.png`,
                'AVATAR'
              )
            }}
            transition={300}
            style={styles.image}
          />
          <Text style={styles.text}>{identity.ens.name}</Text>
        </View>
      )}
      {identity?.worldcoin.isHuman && (
        <View style={styles.badge}>
          <ExpoImage
            source={{
              uri: imageCdn(
                `${STATIC_ASSETS}/mobile/images/products/worldcoin.png`,
                'AVATAR'
              )
            }}
            transition={300}
            style={styles.image}
          />
          <Text style={styles.text}>Person</Text>
        </View>
      )}
      {identity?.proofOfHumanity && (
        <View style={styles.badge}>
          <ExpoImage
            source={{
              uri: imageCdn(
                `${STATIC_ASSETS}/mobile/images/products/poh.png`,
                'AVATAR'
              )
            }}
            transition={300}
            style={styles.image}
          />
          <Text style={styles.text}>Human</Text>
        </View>
      )}
      {identity?.sybilDotOrg.verified && (
        <View style={styles.badge}>
          <ExpoImage
            source={{
              uri: imageCdn(
                `${STATIC_ASSETS}/mobile/images/products/sybil.png`,
                'AVATAR'
              )
            }}
            transition={300}
            style={styles.image}
          />
          <Text style={styles.text}>
            {identity?.sybilDotOrg.source.twitter.handle}
          </Text>
        </View>
      )}
    </ScrollView>
  )
}

export default OnChainInfo
