import { useQuery } from '@apollo/client'
import Timeline from '@components/Home/Timeline'
import TimelineShimmer from '@components/Shimmers/TimelineShimmer'
import { Loader } from '@components/UIElements/Loader'
import { NoDataFound } from '@components/UIElements/NoDataFound'
import logger from '@lib/logger'
import {
  LENS_CUSTOM_FILTERS,
  LENSTUBE_APP_ID,
  LENSTUBE_BYTES_APP_ID
} from '@utils/constants'
import { Mixpanel, TRACK } from '@utils/track'
import React, { useEffect, useState } from 'react'
import { useInView } from 'react-cool-inview'
import {
  ExploreDocument,
  PaginatedResultInfo,
  PublicationSortCriteria,
  PublicationTypes
} from 'src/types/lens'
import { LenstubePublication } from 'src/types/local'

const request = {
  sortCriteria: PublicationSortCriteria.Latest,
  limit: 16,
  noRandomize: true,
  sources: [LENSTUBE_APP_ID, LENSTUBE_BYTES_APP_ID],
  publicationTypes: [PublicationTypes.Post],
  customFilters: LENS_CUSTOM_FILTERS
}

const Recents = () => {
  const [videos, setVideos] = useState<LenstubePublication[]>([])
  const [pageInfo, setPageInfo] = useState<PaginatedResultInfo>()
  useEffect(() => {
    Mixpanel.track('Pageview', { path: TRACK.PAGE_VIEW.EXPLORE_RECENT })
  }, [])

  const { data, loading, error, fetchMore } = useQuery(ExploreDocument, {
    variables: {
      request
    },
    onCompleted(data) {
      setPageInfo(data?.explorePublications?.pageInfo)
      setVideos(data?.explorePublications?.items as LenstubePublication[])
    }
  })

  const { observe } = useInView({
    rootMargin: '1000px 0px',
    onEnter: async () => {
      try {
        const { data } = await fetchMore({
          variables: {
            request: {
              ...request,
              cursor: pageInfo?.next
            }
          }
        })
        setPageInfo(data?.explorePublications?.pageInfo)
        setVideos([
          ...videos,
          ...(data?.explorePublications?.items as LenstubePublication[])
        ])
      } catch (error) {
        logger.error('[Error Fetch Recents]', error)
      }
    }
  })

  return (
    <div>
      {loading && <TimelineShimmer />}
      {data?.explorePublications?.items.length === 0 && (
        <NoDataFound isCenter withImage text="No videos found" />
      )}
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

export default Recents
