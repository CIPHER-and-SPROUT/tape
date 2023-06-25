import {
  getProfilePicture,
  getRelativeTime,
  getThumbnailUrl,
  trimLensHandle
} from '@lenstube/generic'
import type { Publication } from '@lenstube/lens'
import {
  CustomFiltersTypes,
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { FlashList } from '@shopify/flash-list'
import { Image as ExpoImage } from 'expo-image'
import React from 'react'
import { Dimensions, StyleSheet, Text, View } from 'react-native'

import { theme } from '../../constants/theme'
import normalizeFont from '../../helpers/normalize-font'

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 5,
    flex: 1,
    minHeight: Dimensions.get('screen').height
  },
  title: {
    color: theme.colors.primary,
    fontFamily: 'font-bold',
    fontSize: normalizeFont(13),
    letterSpacing: 0.5
  },
  description: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(12),
    color: theme.colors.secondary,
    paddingTop: 10
  },
  thumbnail: {
    width: '100%',
    height: 215,
    borderRadius: 10,
    backgroundColor: theme.colors.background
  },
  otherInfoContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
    opacity: 0.8
  },
  otherInfo: {
    fontFamily: 'font-normal',
    fontSize: normalizeFont(10),
    color: theme.colors.primary
  }
})

const TimelineCell = ({ item }: { item: Publication }) => {
  const thumbnailUrl = getThumbnailUrl(item)

  return (
    <View>
      <ExpoImage
        source={thumbnailUrl}
        contentFit="cover"
        style={styles.thumbnail}
      />
      <View style={{ paddingVertical: 15, paddingHorizontal: 5 }}>
        <Text style={styles.title}>{item.metadata.name}</Text>
        {item.metadata.description && (
          <Text numberOfLines={3} style={styles.description}>
            {item.metadata.description.replace('\n', '')}
          </Text>
        )}
        <View style={styles.otherInfoContainer}>
          <ExpoImage
            source={getProfilePicture(item.profile)}
            contentFit="cover"
            style={{ width: 15, height: 15, borderRadius: 3 }}
          />
          <Text style={styles.otherInfo}>
            {trimLensHandle(item.profile.handle)}
          </Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>{item.stats.totalUpvotes} likes</Text>
          <Text style={{ color: theme.colors.secondary, fontSize: 3 }}>
            {'\u2B24'}
          </Text>
          <Text style={styles.otherInfo}>
            {getRelativeTime(item.createdAt)}
          </Text>
        </View>
      </View>
    </View>
  )
}

const Timeline = () => {
  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 32,
    noRandomize: false,
    sources: ['lenstube'],
    publicationTypes: [PublicationTypes.Post],
    customFilters: [CustomFiltersTypes.Gardeners],
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video]
    }
  }
  const { data } = useExploreQuery({
    variables: { request }
  })

  const videos = data?.explorePublications?.items as Publication[]

  return (
    <View style={styles.container}>
      <FlashList
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        renderItem={({ item }) => {
          return <TimelineCell item={item} />
        }}
        estimatedItemSize={50}
        data={videos}
      />
    </View>
  )
}

export default Timeline
