import KanbanBoard from '../components/KanbanBoard'

function Deals() {
  return (
    <div className="deals-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Pipeline</p>
          <h1>Deal Pipeline</h1>
          <p>Drag-and-drop coming soon – for now review each stage snapshot.</p>
        </div>
        <button type="button" className="primary-btn">
          + New Deal
        </button>
      </header>

      <KanbanBoard />
    </div>
  )
}

export default Deals
