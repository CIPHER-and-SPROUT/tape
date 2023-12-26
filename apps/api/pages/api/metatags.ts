import type { NextApiRequest, NextApiResponse } from 'next'

import { getMetaTags } from '@tape.xyz/browser'
import {
  OG_IMAGE,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME
} from '@tape.xyz/constants'
import getProfileMeta from 'lib/getProfileMeta'
import getPublicationMeta from 'lib/getPublicationMeta'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false })
  }

  const path = req.query.path as string

  if (!path) {
    return res.status(400).json({ success: false })
  }

  const isProfile = path.includes('/u/')
  const isVideo = path.includes('/watch/')
  const isAudio = path.includes('/listen/')
  const isByte = path.includes('/bytes/')

  try {
    if (isProfile) {
      const handle = path.replace('/u/', '')
      return await getProfileMeta(res, handle)
    }

    if (isVideo || isByte || isAudio) {
      const pubId = isByte
        ? path.replace('/bytes/', '')
        : path.replace('/watch/', '').replace('/listen/', '')
      return await getPublicationMeta(res, pubId)
    }

    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        description: TAPE_APP_DESCRIPTION,
        image: OG_IMAGE,
        title: TAPE_APP_NAME
      })
    )
  } catch (error) {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        description: TAPE_APP_DESCRIPTION,
        image: OG_IMAGE,
        title: TAPE_APP_NAME
      })
    )
  }
}

export default handler
