const stages = [
  { name: 'Sourced', description: 'New inbound, warm, or outbound leads.' },
  { name: 'Screen', description: 'Quick checks, analyst notes, light research.' },
  { name: 'Diligence', description: 'Data room reviews, metrics pulls, expert calls.' },
  { name: 'IC', description: 'Investment committee memos, comments, and votes.' },
  { name: 'Invested', description: 'Signed, funded, and actively monitored.' },
  { name: 'Passed', description: 'Closed out with context for future reference.' },
]

function KanbanBoard({ deals, onMoveDeal }) {
  return (
    <div className="kanban-board">
      {stages.map((stage) => {
        const filtered = deals.filter((deal) => deal.stage === stage.name)
        return (
          <KanbanColumn
            key={stage.name}
            stage={stage}
            deals={filtered}
            onMoveDeal={onMoveDeal}
          />
        )
      })}
    </div>
  )
}

function KanbanColumn({ stage, deals, onMoveDeal }) {
  return (
    <section className="kanban-column">
      <header>
        <div>
          <p>{stage.name}</p>
          <span className="column-subtext">{stage.description}</span>
        </div>
        <span>{deals.length}</span>
      </header>
      <div className="kanban-column-body">
        {deals.length === 0 && <p className="empty-state">No deals in this stage yet.</p>}
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} stageName={stage.name} onMoveDeal={onMoveDeal} />
        ))}
      </div>
    </section>
  )
}

function DealCard({ deal, stageName, onMoveDeal }) {
  const handleCardClick = () => {
    window.console.info(`Open deal ${deal.id}`)
  }

  const stageOrder = stages.map((stage) => stage.name)
  const currentIndex = stageOrder.indexOf(stageName)
  const nextStage = currentIndex < stageOrder.length - 1 ? stageOrder[currentIndex + 1] : null

  return (
    <article className="deal-card-wrapper">
      <button className="deal-card" type="button" onClick={handleCardClick}>
        <div className="deal-card-head">
          <div>
            <p className="deal-name">{deal.name}</p>
            <a href={deal.company_url} target="_blank" rel="noreferrer">
              {deal.company_url.replace(/^https?:\/\//, '')}
            </a>
          </div>
          <span className="deal-status">{deal.status}</span>
        </div>
        <p className="deal-stage">Stage: {stageName}</p>
        <dl>
          <div>
            <dt>Owner</dt>
            <dd>{deal.owner}</dd>
          </div>
          <div>
            <dt>Round</dt>
            <dd>{deal.round}</dd>
          </div>
          <div>
            <dt>Check Size</dt>
            <dd>{deal.check_size}</dd>
          </div>
        </dl>
      </button>
      {nextStage && (
        <button className="move-btn" type="button" onClick={() => onMoveDeal(deal.id, nextStage)}>
          Move to {nextStage}
        </button>
      )}
    </article>
  )
}

export { stages }
export default KanbanBoard
