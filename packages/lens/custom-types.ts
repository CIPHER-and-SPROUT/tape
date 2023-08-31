import type { WebBundlr } from '@bundlr-network/client'
import type {
  AaveFeeCollectModuleSettings,
  Attribute,
  FeeCollectModuleSettings,
  FreeCollectModuleSettings,
  LimitedFeeCollectModuleSettings,
  LimitedTimedFeeCollectModuleSettings,
  MultirecipientFeeCollectModuleSettings,
  RecipientDataInput,
  RevertCollectModuleSettings,
  SimpleCollectModuleSettings,
  TimedFeeCollectModuleSettings
} from '@lenstube/lens'

export type VideoDraft = {
  preview: string
  title: string
  description: string
}

export type BundlrDataState = {
  instance: WebBundlr | null
  balance: string
  estimatedPrice: string
  deposit: string | null
  depositing: boolean
  showDeposit: boolean
}

export type FileReaderStreamType = NodeJS.ReadableStream & {
  name: string
  size: number
  type: string
  lastModified: string
}

export type CollectModuleType = {
  isRevertCollect?: boolean
  isSimpleCollect?: boolean
  isFeeCollect?: boolean
  isMultiRecipientFeeCollect?: boolean
  amount?: { currency?: string; value: string }
  referralFee?: number
  collectLimitEnabled?: boolean
  collectLimit?: string
  timeLimitEnabled?: boolean
  followerOnlyCollect?: boolean
  recipient?: string
  multiRecipients?: RecipientDataInput[]
}

export type ReferenceModuleType = {
  followerOnlyReferenceModule: boolean
  degreesOfSeparationReferenceModule?: {
    commentsRestricted: boolean
    mirrorsRestricted: boolean
    degreesOfSeparation: number
  } | null
}

export type UploadedVideo = {
  stream: FileReaderStreamType | null
  preview: string
  videoType: string
  file: File | null
  title: string
  description: string
  thumbnail: string
  thumbnailType: string
  videoCategory: { tag: string; name: string }
  percent: number
  isSensitiveContent: boolean
  isUploadToIpfs: boolean
  loading: boolean
  uploadingThumbnail: boolean
  videoSource: string
  buttonText: string
  durationInSeconds: string | null
  collectModule: CollectModuleType
  referenceModule: ReferenceModuleType
  isByteVideo: boolean
}

export type IPFSUploadResult = {
  url: string
  type: string
}

export type VideoUploadForm = {
  videoThumbnail: IPFSUploadResult | null
  videoSource: string | null
  title: string
  description: string
  adultContent: boolean
}

export type ProfileMetadata = {
  version: string
  metadata_id: string
  name: string | null
  bio: string | null
  cover_picture: string | null
  attributes: Attribute[]
}

type MultiRecipientFeeCollectModuleSettings =
  MultirecipientFeeCollectModuleSettings & {
    optionalEndTimestamp?: string
    optionalCollectLimit?: string
  }

export type LenstubeCollectModule = FreeCollectModuleSettings &
  FeeCollectModuleSettings &
  RevertCollectModuleSettings &
  TimedFeeCollectModuleSettings &
  LimitedFeeCollectModuleSettings &
  LimitedTimedFeeCollectModuleSettings &
  MultiRecipientFeeCollectModuleSettings &
  SimpleCollectModuleSettings &
  AaveFeeCollectModuleSettings

export interface CustomErrorWithData extends Error {
  data?: {
    message: string
  }
}

export interface ProfileInterest {
  category: { label: string; id: string }
  subCategories: Array<{ label: string; id: string }>
}

export type QueuedVideoType = {
  thumbnailUrl: string
  title: string
  txnId?: string
  txnHash?: string
}

export type QueuedCommentType = {
  comment: string
  pubId: string
  txnId?: string
  txnHash?: string
}

export enum CustomCommentsFilterEnum {
  RELEVANT_COMMENTS = 'RelevantComments',
  NEWEST_COMMENTS = 'NewestComments'
}

export enum CustomNotificationsFilterEnum {
  HIGH_SIGNAL = 'HighSignal',
  ALL_NOTIFICATIONS = 'AllNotifications'
}

// MOBILE

export enum TimelineFeedType {
  CURATED = 'CURATED',
  FOLLOWING = 'FOLLOWING',
  HIGHLIGHTS = 'HIGHLIGHTS',
  ALGORITHM = 'ALGORITHM'
}

export enum AlgoType {
  K3L_RECOMMENDED = 'K3L_RECOMMENDED',
  K3L_POPULAR = 'K3L_POPULAR',
  K3L_CROWDSOURCED = 'K3L_CROWDSOURCED'
}

export enum ALGO_PROVIDER {
  K3L = 'K3L'
}

export const MOBILE_PROFILE_ITEMS = [
  'Clan',
  'Media',
  'Bytes',
  'Replies',
  'Gallery'
] as const

export type MobileProfileTabItemType = (typeof MOBILE_PROFILE_ITEMS)[number]

export interface MobileThemeConfig {
  textColor: string
  secondaryTextColor: string
  backgroudColor: string
  backgroudColor2: string
  backgroudColor3: string
  sheetBackgroundColor: string
  borderColor: string
  contrastBorderColor: string
  sheetBorderColor: string
  contrastBackgroundColor: string
  contrastTextColor: string
  buttonBackgroundColor: string
  buttonTextColor: string
}
