import HeartFilled from '@components/Common/Icons/HeartFilled'
import HeartOutline from '@components/Common/Icons/HeartOutline'
import useProfileStore from '@lib/store/idb/profile'
import { Button } from '@radix-ui/themes'
import { SIGN_IN_REQUIRED } from '@tape.xyz/constants'
import { EVENTS, formatNumber, getPublication, Tower } from '@tape.xyz/generic'
import type { AnyPublication } from '@tape.xyz/lens'
import {
  PublicationReactionType,
  useAddReactionMutation,
  useRemoveReactionMutation
} from '@tape.xyz/lens'
import clsx from 'clsx'
import type { FC } from 'react'
import React, { useState } from 'react'
import toast from 'react-hot-toast'

type Props = {
  publication: AnyPublication
  iconSize?: 'sm' | 'base' | 'lg'
  textSize?: 'sm' | 'inherit'
  isVertical?: boolean
  label?: string
  className?: string
  variant?: 'ghost' | 'surface' | 'soft'
  color?: 'blue' | 'crimson'
}

const PublicationReaction: FC<Props> = ({
  publication,
  iconSize = 'sm',
  textSize = 'sm',
  isVertical = false,
  label,
  variant = 'ghost',
  className,
  color
}) => {
  const targetPublication = getPublication(publication)

  const { activeProfile } = useProfileStore()

  const [reaction, setReaction] = useState({
    isLiked: targetPublication.operations.hasReacted,
    likeCount: targetPublication.stats?.reactions
  })

  const [addReaction] = useAddReactionMutation({
    onError: (error) => {
      toast.error(error?.message)
    }
  })
  const [removeReaction] = useRemoveReactionMutation({
    onError: (error) => {
      toast.error(error?.message)
    }
  })

  const likeVideo = () => {
    if (!activeProfile?.id) {
      return toast.error(SIGN_IN_REQUIRED)
    }
    setReaction((prev) => ({
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
      isLiked: !prev.isLiked
    }))
    if (reaction.isLiked) {
      removeReaction({
        variables: {
          request: {
            for: publication.id,
            reaction: PublicationReactionType.Upvote
          }
        }
      })
    } else {
      addReaction({
        variables: {
          request: {
            for: publication.id,
            reaction: PublicationReactionType.Upvote
          }
        }
      })
      Tower.track(EVENTS.PUBLICATION.LIKE)
    }
  }

  return (
    <Button
      variant={variant}
      color={color}
      className={className}
      highContrast
      onClick={() => likeVideo()}
    >
      <span
        className={clsx(
          'flex items-center focus:outline-none',
          isVertical ? 'flex-col space-y-1' : 'space-x-1',
          {
            'text-red-500': reaction.isLiked
          }
        )}
      >
        {reaction.isLiked ? (
          <HeartFilled
            className={clsx({
              'size-3.5': iconSize === 'sm',
              'size-6': iconSize === 'lg',
              'size-4': iconSize === 'base'
            })}
          />
        ) : (
          <HeartOutline
            className={clsx({
              'size-3.5': iconSize === 'sm',
              'size-6': iconSize === 'lg',
              'size-4': iconSize === 'base'
            })}
          />
        )}
        {label ? (
          <span
            className={clsx({
              'text-xs': textSize === 'sm',
              'text-inherit': textSize === 'inherit',
              'text-red-400': reaction.isLiked
            })}
          >
            {label}
          </span>
        ) : (
          <span
            className={clsx({
              'text-xs': textSize === 'sm',
              'text-inherit': textSize === 'inherit',
              'text-red-400': reaction.isLiked
            })}
          >
            {reaction.likeCount > 0 ? formatNumber(reaction.likeCount) : 'Like'}
          </span>
        )}
      </span>
    </Button>
  )
}

export default PublicationReaction
