import { LENS_CUSTOM_FILTERS } from '@lenstube/constants'
import type { Publication } from '@lenstube/lens'
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  PublicationTypes,
  useExploreQuery
} from '@lenstube/lens'
import { useScrollToTop } from '@react-navigation/native'
import { FlashList } from '@shopify/flash-list'
import React, { useCallback, useMemo, useRef } from 'react'
import { ActivityIndicator, Dimensions, StyleSheet, View } from 'react-native'

import AudioCard from '../common/AudioCard'
import VideoCard from '../common/VideoCard'
import ByteCards from './ByteCards'
import FirstSteps from './FirstSteps'
import PopularCreators from './PopularCreators'
import Streak from './Streak'
import TimelineFilters from './TimelineFilters'

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    flex: 1,
    height: Dimensions.get('screen').height
  }
})

const Timeline = () => {
  const scrollRef = useRef<FlashList<Publication>>(null)
  //@ts-expect-error FlashList as type is not supported
  useScrollToTop(scrollRef)

  const request = {
    sortCriteria: PublicationSortCriteria.CuratedProfiles,
    limit: 50,
    noRandomize: false,
    publicationTypes: [PublicationTypes.Post],
    customFilters: LENS_CUSTOM_FILTERS,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Audio, PublicationMainFocus.Video]
    }
  }
  const { data, fetchMore, loading } = useExploreQuery({
    variables: { request }
  })

  const publications = data?.explorePublications?.items as Publication[]
  const pageInfo = data?.explorePublications?.pageInfo

  const fetchMorePublications = async () => {
    await fetchMore({
      variables: {
        request: {
          ...request,
          cursor: pageInfo?.next
        }
      }
    })
  }

  const renderItem = useCallback(
    ({ item }: { item: Publication }) =>
      item.metadata.mainContentFocus === PublicationMainFocus.Audio ? (
        <AudioCard audio={item} />
      ) : (
        <VideoCard video={item} />
      ),
    []
  )

  const HeaderComponent = useMemo(
    () => (
      <>
        <ByteCards />
        <FirstSteps />
        <PopularCreators />
        <Streak />
        <TimelineFilters />
      </>
    ),
    []
  )

  if (loading || !publications?.length) {
    return <ActivityIndicator style={{ flex: 1 }} />
  }

  return (
    <View style={styles.container}>
      <FlashList
        ref={scrollRef}
        ListHeaderComponent={HeaderComponent}
        data={publications}
        estimatedItemSize={publications.length}
        renderItem={renderItem}
        keyExtractor={(item, i) => `${item.id}_${i}`}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        ListFooterComponent={() => (
          <ActivityIndicator style={{ paddingVertical: 20 }} />
        )}
        onEndReached={fetchMorePublications}
        onEndReachedThreshold={0.8}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}

export default Timeline
