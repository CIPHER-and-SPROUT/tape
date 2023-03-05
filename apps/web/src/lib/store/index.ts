import { WebBundlr } from '@bundlr-network/client'
import type { FetchSignerResult } from '@wagmi/core'
import type { Profile } from 'lens'
import type { BundlrDataState, UploadedVideo } from 'utils'
import {
  BUNDLR_CURRENCY,
  BUNDLR_NODE_URL,
  CustomCommentsFilterEnum,
  POLYGON_RPC_URL,
  WMATIC_TOKEN_ADDRESS
} from 'utils'
import { CREATOR_VIDEO_CATEGORIES } from 'utils/data/categories'
import logger from 'utils/logger'
import { create } from 'zustand'

export const UPLOADED_VIDEO_BUNDLR_DEFAULTS = {
  balance: '0',
  estimatedPrice: '0',
  deposit: null,
  instance: null,
  depositing: false,
  showDeposit: false
}

export const UPLOADED_VIDEO_FORM_DEFAULTS = {
  stream: null,
  preview: '',
  videoType: '',
  file: null,
  title: '',
  description: '',
  thumbnail: '',
  thumbnailType: '',
  videoSource: '',
  percent: 0,
  isSensitiveContent: false,
  isUploadToIpfs: false,
  loading: false,
  uploadingThumbnail: false,
  buttonText: 'Post Video',
  durationInSeconds: null,
  videoCategory: CREATOR_VIDEO_CATEGORIES[0],
  isByteVideo: false,
  collectModule: {
    type: 'revertCollectModule',
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    referralFee: 0,
    isTimedFeeCollect: false,
    isFreeCollect: false,
    isFeeCollect: false,
    isRevertCollect: true,
    isLimitedFeeCollect: false,
    isLimitedTimeFeeCollect: false,
    isMultiRecipientFeeCollect: false,
    collectLimit: '1',
    multiRecipients: []
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  }
}

interface AppState {
  channels: Profile[]
  recommendedChannels: Profile[]
  showCreateChannel: boolean
  hasNewNotification: boolean
  userSigNonce: number
  bundlrData: BundlrDataState
  uploadedVideo: UploadedVideo
  selectedChannel: Profile | null
  videoWatchTime: number
  activeTagFilter: string
  selectedCommentFilter: CustomCommentsFilterEnum
  setUploadedVideo: <T extends UploadedVideo>(video: T) => void
  setActiveTagFilter: (activeTagFilter: string) => void
  setVideoWatchTime: (videoWatchTime: number) => void
  setSelectedChannel: (channel: Profile | null) => void
  setUserSigNonce: (userSigNonce: number) => void
  setShowCreateChannel: (showCreateChannel: boolean) => void
  setChannels: (channels: Profile[]) => void
  setRecommendedChannels: (channels: Profile[]) => void
  setHasNewNotification: (value: boolean) => void
  setBundlrData: <T extends BundlrDataState>(bundlrData: T) => void
  getBundlrInstance: (signer: FetchSignerResult) => Promise<WebBundlr | null>
  setSelectedCommentFilter: (filter: CustomCommentsFilterEnum) => void
}

// TODO: Split into multiple stores
export const useAppStore = create<AppState>((set) => ({
  channels: [],
  recommendedChannels: [],
  showCreateChannel: false,
  hasNewNotification: false,
  userSigNonce: 0,
  selectedChannel: null,
  videoWatchTime: 0,
  activeTagFilter: 'all',
  bundlrData: UPLOADED_VIDEO_BUNDLR_DEFAULTS,
  uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,
  setActiveTagFilter: (activeTagFilter) => set({ activeTagFilter }),
  setVideoWatchTime: (videoWatchTime) => set({ videoWatchTime }),
  selectedCommentFilter: CustomCommentsFilterEnum.RELEVANT_COMMENTS,
  setSelectedCommentFilter: (selectedCommentFilter) =>
    set({ selectedCommentFilter }),
  setSelectedChannel: (channel) => set({ selectedChannel: channel }),
  setBundlrData: (bundlrData) =>
    set((state) => ({ bundlrData: { ...state.bundlrData, ...bundlrData } })),
  setUserSigNonce: (userSigNonce) => set({ userSigNonce }),
  setHasNewNotification: (b) => set({ hasNewNotification: b }),
  setChannels: (channels) => set({ channels }),
  setRecommendedChannels: (recommendedChannels) => set({ recommendedChannels }),
  setShowCreateChannel: (showCreateChannel) => set({ showCreateChannel }),
  getBundlrInstance: async (signer) => {
    try {
      const bundlr = new WebBundlr(
        BUNDLR_NODE_URL,
        BUNDLR_CURRENCY,
        signer?.provider,
        {
          providerUrl: POLYGON_RPC_URL
        }
      )
      await bundlr.utils.getBundlerAddress(BUNDLR_CURRENCY)
      await bundlr.ready()
      return bundlr
    } catch (error) {
      logger.error('[Error Init Bundlr]', error)
      return null
    }
  },
  setUploadedVideo: (uploadedVideo) => set({ uploadedVideo })
}))

export default useAppStore
