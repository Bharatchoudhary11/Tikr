import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ActivityFeed from '../components/ActivityFeed'
import KanbanBoard, { stages } from '../components/KanbanBoard'
import sampleDeals from '../data/sampleDeals'

function Deals() {
  const [deals, setDeals] = useState(sampleDeals)
  const [activities, setActivities] = useState([])

  const stageOrder = useMemo(() => stages.map((stage) => stage.name), [])

  const handleMoveDeal = (dealId, nextStage) => {
    const movedDeal = deals.find((deal) => deal.id === dealId)
    if (!movedDeal) return

    setDeals((prevDeals) =>
      prevDeals.map((deal) => (deal.id === dealId ? { ...deal, stage: nextStage } : deal)),
    )

    const timestamp = new Date().toLocaleString()
    setActivities((prev) => [
      {
        id: `${Date.now()}`,
        message: `${movedDeal.owner} moved ${movedDeal.name} from ${movedDeal.stage} to ${nextStage}`,
        timestamp,
      },
      ...prev,
    ])
  }

  const summary = useMemo(() => {
    return stageOrder.map((stageName) => ({
      name: stageName,
      count: deals.filter((deal) => deal.stage === stageName).length,
    }))
  }, [deals, stageOrder])

  return (
    <div className="deals-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h1>Deal Pipeline</h1>
          <p>Click cards to review details, use Move buttons to advance the stage.</p>
          <div className="pipeline-summary">
            {summary.map((entry) => (
              <span key={entry.name}>
                {entry.name}: <strong>{entry.count}</strong>
              </span>
            ))}
          </div>
        </div>
        <div className="button-stack">
          <button type="button" className="primary-btn">
            + New Deal
          </button>
          <Link to="/memos" className="ghost-link">
            Go to IC Memo
          </Link>
        </div>
      </header>

      <div className="deal-layout">
        <KanbanBoard deals={deals} onMoveDeal={handleMoveDeal} />
        <ActivityFeed items={activities} />
      </div>
    </div>
  )
}

export default Deals
