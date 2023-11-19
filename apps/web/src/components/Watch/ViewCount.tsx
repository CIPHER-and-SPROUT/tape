import { useVideoViews } from '@dragverse/browser'

const ViewCount = ({ cid }: { cid: string }) => {
  const { views } = useVideoViews(cid)

  return (
    <>
      <span>{views} views</span>
      <span className="middot px-1" />
    </>
  )
}

export default ViewCount
