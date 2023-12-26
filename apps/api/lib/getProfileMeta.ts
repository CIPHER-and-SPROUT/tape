import { getMetaTags } from '@tape.xyz/browser'
import {
  LENS_NAMESPACE_PREFIX,
  OG_IMAGE,
  TAPE_APP_DESCRIPTION,
  TAPE_APP_NAME
} from '@tape.xyz/constants'
import { getProfile, getProfilePicture } from '@tape.xyz/generic'
import type { Profile, ProfileRequest } from '@tape.xyz/lens'
import { ProfileDocument } from '@tape.xyz/lens'
import { apolloClient } from '@tape.xyz/lens/apollo'
import type { NextApiResponse } from 'next'

const client = apolloClient()

const getProfileMeta = async (res: NextApiResponse, reqHandle: string) => {
  try {
    const handle = reqHandle.replace(LENS_NAMESPACE_PREFIX, '')
    const request: ProfileRequest = {
      forHandle: `${LENS_NAMESPACE_PREFIX}${handle}`
    }

    const { data } = await client.query({
      query: ProfileDocument,
      variables: {
        request
      }
    })

    const profile: Profile = data?.profile
    const title = getProfile(profile)?.displayName
    const description = profile?.metadata?.bio || TAPE_APP_DESCRIPTION
    const image = getProfilePicture(profile, 'AVATAR_LG')

    return res
      .setHeader('Content-Type', 'text/html')
      .setHeader('Cache-Control', 's-maxage=86400')
      .send(
        getMetaTags({
          title,
          description: description.replaceAll('\n', ' '),
          image,
          page: 'PROFILE',
          handle
        })
      )
  } catch {
    return res.setHeader('Content-Type', 'text/html').send(
      getMetaTags({
        title: TAPE_APP_NAME,
        description: TAPE_APP_DESCRIPTION,
        image: OG_IMAGE
      })
    )
  }
}

export default getProfileMeta
