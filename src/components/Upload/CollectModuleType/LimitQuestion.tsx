import clsx from 'clsx'
import type { FC } from 'react'
import React from 'react'
import { AiOutlineCheck } from 'react-icons/ai'
import type { CollectModuleType, UploadedVideo } from 'src/types/local'

type Props = {
  uploadedVideo: UploadedVideo
  setCollectType: (data: CollectModuleType) => void
}

const LimitQuestion: FC<Props> = ({ uploadedVideo, setCollectType }) => {
  return (
    <div className="space-y-2">
      <h6>Would you like to limit the collects?</h6>
      <div className="flex flex-wrap gap-1.5 md:flex-nowrap">
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isLimitedFeeCollect: false,
              isLimitedTimeFeeCollect: false,
              isFeeCollect: false,
              isFreeCollect: uploadedVideo.collectModule.isTimedFeeCollect
                ? false
                : true
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 hover:!border-indigo-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-indigo-500':
                !uploadedVideo.collectModule.isLimitedFeeCollect
            }
          )}
        >
          <span>Unlimited collects</span>
          {!uploadedVideo.collectModule.isLimitedFeeCollect && (
            <AiOutlineCheck />
          )}
        </button>
        <button
          type="button"
          onClick={() =>
            setCollectType({
              isFeeCollect: true,
              isFreeCollect: false,
              isLimitedFeeCollect: true,
              isLimitedTimeFeeCollect: uploadedVideo.collectModule
                .isTimedFeeCollect
                ? true
                : false
            })
          }
          className={clsx(
            'flex items-center justify-between w-full px-4 py-2 text-sm border border-gray-300 hover:!border-indigo-500 focus:outline-none dark:border-gray-700 rounded-xl',
            {
              '!border-indigo-500':
                uploadedVideo.collectModule.isLimitedFeeCollect
            }
          )}
        >
          <span>Limited collect</span>
          {uploadedVideo.collectModule.isLimitedFeeCollect && (
            <AiOutlineCheck />
          )}
        </button>
      </div>
    </div>
  )
}

export default LimitQuestion
