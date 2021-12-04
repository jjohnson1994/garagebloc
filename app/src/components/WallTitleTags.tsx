interface Props {
  routeCount: number,
  logCount: number,
  memberCount: number
}
const WallTitleTags: React.FC<Props> = ({ routeCount, logCount, memberCount }) => {
  return (
    <div className="tags">
      <span className="tag">{routeCount} Routes</span>
      <span className="tag">{logCount} Logs</span>
      <span className="tag">
        {memberCount}{" "}
        {memberCount > 1 ? "Members" : "Member"}
      </span>
    </div>
  )
}

export default WallTitleTags
