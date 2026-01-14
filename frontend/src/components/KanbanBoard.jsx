const stages = [
  { name: 'Sourced', description: 'New inbound, warm, or outbound leads.' },
  { name: 'Screen', description: 'Quick checks, analyst notes, light research.' },
  { name: 'Diligence', description: 'Data room reviews, metrics pulls, expert calls.' },
  { name: 'IC', description: 'Investment committee memos, comments, and votes.' },
  { name: 'Invested', description: 'Signed, funded, and actively monitored.' },
  { name: 'Passed', description: 'Closed out with context for future reference.' },
]

const sampleDeals = [
  {
    id: 'DL-101',
    name: 'Meridian Health',
    company_url: 'https://meridian.health',
    owner: 'Lena Garcia',
    stage: 'Screen',
    round: 'Series A',
    check_size: '$3.5M',
    status: 'Reviewing',
  },
  {
    id: 'DL-102',
    name: 'FleetOS',
    company_url: 'https://fleetos.io',
    owner: 'Amin Patel',
    stage: 'Diligence',
    round: 'Seed',
    check_size: '$1.2M',
    status: 'Data Room',
  },
  {
    id: 'DL-103',
    name: 'Verta Carbon',
    company_url: 'https://vertacarbon.com',
    owner: 'Nate Liu',
    stage: 'Sourced',
    round: 'Series B',
    check_size: '$8M',
    status: 'Intro',
  },
  {
    id: 'DL-104',
    name: 'CloudLedger',
    company_url: 'https://cloudledger.app',
    owner: 'Mira Le',
    stage: 'IC',
    round: 'Series A',
    check_size: '$5M',
    status: 'Voting',
  },
  {
    id: 'DL-105',
    name: 'Hydra Robotics',
    company_url: 'https://hydrarobotics.ai',
    owner: 'DeShawn King',
    stage: 'Invested',
    round: 'Series Seed',
    check_size: '$900K',
    status: 'Monitoring',
  },
  {
    id: 'DL-106',
    name: 'Sprig Foods',
    company_url: 'https://sprigfoods.com',
    owner: 'Lena Garcia',
    stage: 'Passed',
    round: 'Series A',
    check_size: '$4M',
    status: 'Out of scope',
  },
]

function KanbanBoard() {
  return (
    <div className="kanban-board">
      {stages.map((stage) => {
        const deals = sampleDeals.filter((deal) => deal.stage === stage.name)
        return <KanbanColumn key={stage.name} stage={stage} deals={deals} />
      })}
    </div>
  )
}

function KanbanColumn({ stage, deals }) {
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
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
    </section>
  )
}

function DealCard({ deal }) {
  return (
    <article className="deal-card">
      <div className="deal-card-head">
        <div>
          <p className="deal-name">{deal.name}</p>
          <a href={deal.company_url} target="_blank" rel="noreferrer">
            {deal.company_url.replace(/^https?:\/\//, '')}
          </a>
        </div>
        <span className="deal-status">{deal.status}</span>
      </div>
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
    </article>
  )
}

export default KanbanBoard
