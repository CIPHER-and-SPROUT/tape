import { useQuery } from '@apollo/client'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import { FEED_QUERY } from '@gql/queries'
import logger from '@lib/logger'
import useAppStore from '@lib/store'
import React, { useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  PaginatedResultInfo,
  PublicationMainFocus,
  PublicationTypes
} from 'src/types'
import { LenstubePublication } from 'src/types/local'

import Timeline from './Timeline'

const HomeFeed = () => {
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  const selectedChannel = useAppStore((state) => state.selectedChannel)

  const { data, loading, error, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      request: {
        profileId: selectedChannel?.id,
        limit: 12,
        timelineTypes: [PublicationTypes.Post],
        metadata: { mainContentFocus: [PublicationMainFocus.Video] }
      }
    },
    skip: !selectedChannel?.id,
    onCompleted(data) {
      setPageInfo(data?.timeline?.pageInfo)
      setVideos(data?.timeline?.items)
    }
  })

  const { observe } = useInView({
    rootMargin: '50px 0px',
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              profileId: selectedChannel?.id,
              cursor: pageInfo?.next,
              limit: 12,
              timelineTypes: [PublicationTypes.Post],
              metadata: { mainContentFocus: [PublicationMainFocus.Video] }
            }
          }
        })
        setPageInfo(data?.timeline?.pageInfo)
        setVideos([...videos, ...data?.timeline?.items])
      } catch (error) {
        logger.error('[Error Fetch Timeline]', error)
      }
    }
  })

  if (data?.timeline?.items?.length === 0) {
    return (
      <NoDataFound
        isCenter
        withImage
        text="You got no videos in your feed, explore."
      />
    )
  }

  return (
    <div>
      {loading && <TimelineShimmer />}
      {!error && !loading && (
        <>
          <Timeline videos={videos} />
          {pageInfo?.next && videos.length !== pageInfo?.totalCount && (
            <span ref={observe} className="flex justify-center p-10">
              <Loader />
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default HomeFeed
