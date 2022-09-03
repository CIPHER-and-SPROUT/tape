import CollectVideo from '@components/Watch/CollectVideo'
import logger from '@lib/logger'
import getThumbnailUrl from '@utils/functions/getThumbnailUrl'
import { getPermanentVideoUrl, getVideoUrl } from '@utils/functions/getVideoUrl'
import imageCdn from '@utils/functions/imageCdn'
import axios from 'axios'
import React, { FC, useEffect, useRef, useState } from 'react'
import { useInView } from 'react-cool-inview'
import { LenstubePublication } from 'src/types/local'

import BottomOverlay from './BottomOverlay'
import ByteActions from './ByteActions'
import TopOverlay from './TopOverlay'

type Props = {
  video: LenstubePublication
}

const ByteVideo: FC<Props> = ({ video }) => {
  const [playing, setIsPlaying] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoUrl, setVideoUrl] = useState(getVideoUrl(video))

  const checkVideoResource = async () => {
    try {
      await axios.get(videoUrl)
    } catch (error) {
      setVideoUrl(getPermanentVideoUrl(video))
      logger.error('[Error Invalid Byte Playback]', error)
    }
  }

  useEffect(() => {
    checkVideoResource().catch((error) =>
      logger.error('[Error Invalid Byte Playback]', error)
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onClickVideo = () => {
    try {
      if (videoRef.current?.paused) {
        videoRef.current?.play()
        setIsPlaying(true)
      } else {
        videoRef.current?.pause()
        setIsPlaying(false)
      }
    } catch (error) {
      logger.error('[Error Play Byte]', error)
    }
  }

  const { observe } = useInView({
    threshold: 1,
    onLeave: () => {
      videoRef.current?.pause()
      setIsPlaying(false)
    },
    onEnter: () => {
      videoRef.current?.load()
      videoRef.current
        ?.play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          setIsPlaying(false)
          logger.error('[Error AutoPlay Byte]', e)
        })
    }
  })

  return (
    <div ref={observe} className="flex justify-center md:mt-6 snap-center">
      <div className="relative">
        <video
          onContextMenu={(event) => event.preventDefault()}
          onClick={() => onClickVideo()}
          ref={videoRef}
          preload="metadata"
          disableRemotePlayback
          width="345"
          poster={imageCdn(getThumbnailUrl(video), 'thumbnail')}
          className="md:rounded-xl min-w-[250px] w-screen md:w-[345px] 2xl:w-[450px] h-screen bg-black md:h-[calc(100vh-145px)]"
          loop
        >
          <source ref={observe} src={videoUrl} type="video/mp4" />
        </video>
        <TopOverlay playing={playing} onClickPlayPause={onClickVideo} />
        <BottomOverlay video={video} />
        <div className="absolute md:hidden right-2 top-1/2">
          <ByteActions video={video} />
          {video?.collectModule?.__typename !==
            'RevertCollectModuleSettings' && (
            <div className="text-center text-white md:text-gray-500">
              <CollectVideo video={video} variant="secondary" />
              <div className="text-xs">
                {video.stats?.totalAmountOfCollects || 'Collect'}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="hidden md:flex">
        <ByteActions video={video} />
      </div>
    </div>
  )
}

export default ByteVideo
