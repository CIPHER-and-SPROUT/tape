import MetaTags from '@components/Common/MetaTags'
import React from 'react'

import List from './List'

const Blocked = () => {
  return (
    <div className="tape-border rounded-medium dark:bg-cod bg-white p-5">
      <MetaTags title="Blocked Profiles" />
      <div className="mb-5 space-y-2">
        <h1 className="text-brand-400 text-xl font-bold">Blocked Profiles</h1>
        <p className="text opacity-80">
          Here is a list of profiles that you have been blocked. You have the
          option to unblock them whenever you wish.
        </p>
      </div>
      <List />
    </div>
  )
}

export default Blocked
