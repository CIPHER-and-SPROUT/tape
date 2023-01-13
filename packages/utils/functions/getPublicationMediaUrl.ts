import type { Publication } from 'lens'

import { STATIC_ASSETS } from '../constants'
import sanitizeIpfsUrl from './sanitizeIpfsUrl'

export const getPublicationMediaUrl = (video: Publication) => {
  const url = video?.metadata?.media[0]?.original.url
  if (!url) return `${STATIC_ASSETS}/images/fallbackThumbnail.png`
  return sanitizeIpfsUrl(url)
}

export const getIsIPFSUrl = (url: string) => {
  return url?.includes('ipfs')
}
