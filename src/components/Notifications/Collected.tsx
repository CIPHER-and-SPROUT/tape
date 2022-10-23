import IsVerified from '@components/Common/IsVerified'
import AddressExplorerLink from '@components/Common/Links/AddressExplorerLink'
import { NextLink } from '@components/UIElements/DropMenu'
import { Menu } from '@headlessui/react'
import getProfilePicture from '@utils/functions/getProfilePicture'
import { getRandomProfilePicture } from '@utils/functions/getRandomProfilePicture'
import imageCdn from '@utils/functions/imageCdn'
import { shortenAddress } from '@utils/functions/shortenAddress'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import React, { FC } from 'react'
import { NewCollectNotification } from 'src/types'

dayjs.extend(relativeTime)

interface Props {
  notification: NewCollectNotification
}

const CollectedNotification: FC<Props> = ({ notification }) => {
  return (
    <>
      <div className="flex items-center space-x-3">
        {notification?.wallet?.defaultProfile ? (
          <Menu.Item
            as={NextLink}
            href={`/${notification?.wallet?.defaultProfile?.handle}`}
            className="inline-flex items-center space-x-1.5 font-base"
          >
            <img
              className="w-4 h-4 rounded"
              src={getProfilePicture(
                notification.wallet?.defaultProfile,
                'avatar'
              )}
              alt="channel picture"
              draggable={false}
            />
            <div className="flex items-center space-x-0.5">
              <span>{notification?.wallet?.defaultProfile?.handle}</span>
              <IsVerified
                id={notification?.wallet?.defaultProfile?.id}
                size="xs"
              />
            </div>
          </Menu.Item>
        ) : (
          <AddressExplorerLink address={notification?.wallet?.address}>
            <span className="inline-flex items-center space-x-1.5 font-base">
              <img
                className="w-4 h-4 rounded"
                src={imageCdn(
                  getRandomProfilePicture(notification.wallet.address),
                  'avatar'
                )}
                alt="channel picture"
                draggable={false}
              />
              <div>{shortenAddress(notification?.wallet?.address)}</div>
            </span>
          </AddressExplorerLink>
        )}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          collected your
          {notification.collectedPublication.__typename === 'Comment' &&
            ' comment on'}
          <Menu.Item
            as={NextLink}
            href={`/watch/${notification?.collectedPublication.id}`}
            className="ml-1 text-indigo-500"
          >
            video
          </Menu.Item>
        </span>
        <div className="flex items-center space-x-1 text-xs text-gray-400">
          <span>{dayjs(new Date(notification?.createdAt)).fromNow()}</span>
        </div>
      </div>
    </>
  )
}

export default CollectedNotification
