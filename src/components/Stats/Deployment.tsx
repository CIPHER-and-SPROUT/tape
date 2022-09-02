import {
  GIT_DEPLOYED_BRANCH,
  GIT_DEPLOYED_COMMIT_SHA,
  IS_MAINNET,
  RELAYER_ENABLED,
  VERCEL_DEPLOYED_ENV
} from '@utils/constants'
import Link from 'next/link'
import React from 'react'

const Deployment = () => {
  return (
    <div className="flex items-center mb-4 space-x-2">
      <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
        {IS_MAINNET ? 'polygon' : 'mumbai'}
      </span>
      {GIT_DEPLOYED_BRANCH && (
        <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
          {GIT_DEPLOYED_BRANCH}
        </span>
      )}
      {VERCEL_DEPLOYED_ENV && (
        <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
          {VERCEL_DEPLOYED_ENV}
        </span>
      )}
      {RELAYER_ENABLED && (
        <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
          Relayer
        </span>
      )}
      {GIT_DEPLOYED_COMMIT_SHA && (
        <span className="p-1 px-3 text-xs bg-gray-100 rounded-lg dark:bg-[#181818]">
          <Link
            href={`https://github.com/lenstube-xyz/lenstube/commit/${GIT_DEPLOYED_COMMIT_SHA}`}
            target="_blank"
            rel="noreferer noreferrer"
          >
            <span className="text-xs text-indigo-500">
              {GIT_DEPLOYED_COMMIT_SHA?.substring(0, 6)}
            </span>
          </Link>
        </span>
      )}
    </div>
  )
}

export default Deployment
