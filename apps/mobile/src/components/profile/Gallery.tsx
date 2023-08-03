import type { Profile } from '@lenstube/lens'
import type { FC } from 'react'
import React from 'react'

import Timeline from '../explore/Timeline'

type Props = {
  profile: Profile
}

const Gallery: FC<Props> = () => {
  return <Timeline />
}

export default Gallery
