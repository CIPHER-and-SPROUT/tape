import type { HeaderTitleProps } from '@react-navigation/elements'
import { Image as ExpoImage } from 'expo-image'
import type { FC } from 'react'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { theme } from '../constants/theme'
import normalizeFont from '../helpers/normalize-font'

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  forYouText: {
    color: theme.colors.primary[50],
    fontFamily: 'font-bold',
    fontWeight: '500',
    fontSize: normalizeFont(15)
  }
})

const Header: FC<HeaderTitleProps> = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.forYouText}>For Sasi</Text>
      <ExpoImage
        source="https://picsum.photos/seed/696/3000/2000"
        contentFit="cover"
        style={{ width: 30, height: 30, borderRadius: 5 }}
      />
    </View>
  )
}

export default Header
