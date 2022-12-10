import type { UploadedVideo } from 'utils'
import { WMATIC_TOKEN_ADDRESS } from 'utils'
import { CREATOR_VIDEO_CATEGORIES } from 'utils/data/categories'
import create from 'zustand'
import { persist } from 'zustand/middleware'

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
  playbackId: '',
  isSensitiveContent: false,
  isUploadToIpfs: false,
  loading: false,
  uploadingThumbnail: false,
  buttonText: 'Post Video',
  durationInSeconds: null,
  videoCategory: CREATOR_VIDEO_CATEGORIES[0],
  collectModule: {
    type: 'revertCollectModule',
    followerOnlyCollect: false,
    amount: { currency: WMATIC_TOKEN_ADDRESS, value: '' },
    referralFee: 0,
    isTimedFeeCollect: false,
    isFreeCollect: false,
    isFeeCollect: false,
    isRevertCollect: true
  },
  referenceModule: {
    followerOnlyReferenceModule: false,
    degreesOfSeparationReferenceModule: null
  },
  isNSFW: false,
  isNSFWThumbnail: false,
  isByteVideo: false,
  txnId: null
}

interface AppPerisistState {
  selectedChannelId: string | null
  sidebarCollapsed: boolean
  notificationCount: number
  uploadedVideo: UploadedVideo
  setUploadedVideo: (video: { [k: string]: any }) => void
  setNotificationCount: (count: number) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  setSelectedChannelId: (id: string | null) => void
}

export const usePersistStore = create(
  persist<AppPerisistState>(
    (set) => ({
      selectedChannelId: null,
      sidebarCollapsed: true,
      notificationCount: 0,
      uploadedVideo: UPLOADED_VIDEO_FORM_DEFAULTS,
      setSidebarCollapsed: (sidebarCollapsed) =>
        set(() => ({ sidebarCollapsed })),
      setNotificationCount: (notificationCount) =>
        set(() => ({ notificationCount })),
      setSelectedChannelId: (id) => set(() => ({ selectedChannelId: id })),
      setUploadedVideo: (videoData) =>
        set((state) => ({
          uploadedVideo: { ...state.uploadedVideo, ...videoData }
        }))
    }),
    {
      name: 'lenstube.store'
    }
  )
)

export default usePersistStore
