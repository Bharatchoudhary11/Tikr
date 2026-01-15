function ActivityFeed({ items }) {
  if (!items.length) {
    return (
      <div className="activity-feed">
        <h2>Activity</h2>
        <p className="empty-state">Stage changes will appear here.</p>
      </div>
    )
  }

  return (
    <div className="activity-feed">
      <h2>Activity</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <p>{item.message}</p>
            <span>{item.timestamp}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ActivityFeed
