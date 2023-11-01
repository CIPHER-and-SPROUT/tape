import Badge from '@components/Common/Badge'
import HoverableProfile from '@components/Common/HoverableProfile'
import ChevronDownOutline from '@components/Common/Icons/ChevronDownOutline'
import ChevronUpOutline from '@components/Common/Icons/ChevronUpOutline'
import CommentOutline from '@components/Common/Icons/CommentOutline'
import HeartFilled from '@components/Common/Icons/HeartFilled'
import ReplyOutline from '@components/Common/Icons/ReplyOutline'
import InterweaveContent from '@components/Common/InterweaveContent'
import Tooltip from '@components/UIElements/Tooltip'
import useHandleWrongNetwork from '@hooks/useHandleWrongNetwork'
import { getShortHandTime } from '@lib/formatTime'
import usePersistStore from '@lib/store/persist'
import useProfileStore from '@lib/store/profile'
import { Button, Flex, Text } from '@radix-ui/themes'
import { SIGN_IN_REQUIRED } from '@tape.xyz/constants'
import {
  getProfile,
  getProfilePicture,
  getPublicationData,
  getValueFromKeyInAttributes
} from '@tape.xyz/generic'
import type { Comment } from '@tape.xyz/lens'
import clsx from 'clsx'
import Link from 'next/link'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import PublicationReaction from '../PublicationReaction'
import CommentMedia from './CommentMedia'
import CommentOptions from './CommentOptions'
import CommentReplies from './CommentReplies'
import NewComment from './NewComment'
import QueuedComment from './QueuedComment'

interface Props {
  comment: Comment
}

const RenderComment: FC<Props> = ({ comment }) => {
  const [clamped, setClamped] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [showNewComment, setShowNewComment] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [defaultComment, setDefaultComment] = useState('')
  const handleWrongNetwork = useHandleWrongNetwork()

  const queuedComments = usePersistStore((state) => state.queuedComments)
  const { activeProfile } = useProfileStore()

  const metadata = getPublicationData(comment.metadata)

  useEffect(() => {
    if (metadata?.content && metadata?.content?.trim().length > 500) {
      setClamped(true)
      setShowMore(true)
    }
  }, [metadata?.content])

  const getIsReplyQueuedComment = () => {
    return Boolean(queuedComments.filter((c) => c.pubId === comment.id)?.length)
  }

  return (
    <div className="flex items-start justify-between">
      <div className="flex w-full items-start">
        <Link
          href={getProfile(comment.by)?.link}
          className="mr-3 mt-0.5 flex-none"
        >
          <img
            src={getProfilePicture(comment.by, 'AVATAR')}
            className="h-8 w-8 rounded-full"
            draggable={false}
            alt={getProfile(comment.by)?.slug}
          />
        </Link>
        <div className="mr-2 flex w-full flex-col items-start">
          <span className="mb-1 flex items-center">
            <HoverableProfile profile={comment.by}>
              <Link
                href={getProfile(comment.by)?.link}
                className="flex items-center space-x-1 font-medium"
              >
                <span>{getProfile(comment.by)?.slug}</span>
                <Badge id={comment?.by.id} />
              </Link>
            </HoverableProfile>
            {getValueFromKeyInAttributes(
              comment?.metadata?.attributes,
              'hash'
            ) && (
              <Tooltip placement="top" content="Supporter">
                <span className="pl-1.5">
                  <HeartFilled className="h-3 w-3 text-red-500" />
                </span>
              </Tooltip>
            )}
            <span className="middot" />
            <span className="text-sm">
              {getShortHandTime(comment.createdAt)}
            </span>
          </span>
          <div className={clsx({ 'line-clamp-2': clamped })}>
            <InterweaveContent content={metadata?.content ?? ''} />
          </div>
          {showMore && (
            <div className="mt-2 inline-flex">
              <button
                type="button"
                onClick={() => setClamped(!clamped)}
                className="flex items-center text-sm opacity-80 outline-none hover:opacity-100"
              >
                {clamped ? (
                  <>
                    Show more <ChevronDownOutline className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    Show less <ChevronUpOutline className="ml-1 h-3 w-3" />
                  </>
                )}
              </button>
            </div>
          )}
          <CommentMedia comment={comment} />
          {!comment.isHidden && (
            <Flex mt="2" gap="4">
              <PublicationReaction publication={comment} />
              <Button
                variant="ghost"
                highContrast
                onClick={() => {
                  if (!activeProfile?.id) {
                    return toast.error(SIGN_IN_REQUIRED)
                  }
                  if (handleWrongNetwork()) {
                    return
                  }
                  setShowNewComment(!showNewComment)
                  setDefaultComment('')
                }}
              >
                <ReplyOutline className="h-3.5 w-3.5" />
                <span className="text-xs">Reply</span>
              </Button>
              {comment.stats.comments ? (
                <Button
                  variant="ghost"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  <CommentOutline className="h-3.5 w-3.5" />
                  <Text size="1" highContrast color="gray">
                    {comment.stats.comments} replies
                  </Text>
                </Button>
              ) : null}
            </Flex>
          )}
          <div
            className={clsx(
              'w-full space-y-6',
              (showReplies || showNewComment || getIsReplyQueuedComment()) &&
                'pt-6'
            )}
          >
            {queuedComments?.map(
              (queuedComment) =>
                queuedComment?.pubId === comment?.id && (
                  <QueuedComment
                    key={queuedComment?.pubId}
                    queuedComment={queuedComment}
                  />
                )
            )}
            {showReplies && (
              <CommentReplies
                comment={comment}
                replyTo={(profile) => {
                  if (!activeProfile?.id) {
                    return toast.error(SIGN_IN_REQUIRED)
                  }
                  if (handleWrongNetwork()) {
                    return
                  }
                  setShowNewComment(true)
                  setDefaultComment(`@${profile.handle?.fullHandle} `)
                }}
              />
            )}
            {showNewComment && (
              <NewComment
                video={comment}
                defaultValue={defaultComment}
                placeholder="Write a reply"
                hideEmojiPicker
                resetReply={() => {
                  setDefaultComment('')
                  setShowNewComment(false)
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div>
        <CommentOptions comment={comment} />
      </div>
    </div>
  )
}

export default RenderComment
