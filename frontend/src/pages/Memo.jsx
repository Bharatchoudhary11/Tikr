import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const SECTIONS = [
  { key: 'summary', label: 'Summary' },
  { key: 'market', label: 'Market' },
  { key: 'product', label: 'Product' },
  { key: 'traction', label: 'Traction' },
  { key: 'risks', label: 'Risks' },
  { key: 'questions', label: 'Open Questions' },
]

function Memo() {
  const [memoValues, setMemoValues] = useState(() =>
    SECTIONS.reduce((acc, section) => {
      acc[section.key] = ''
      return acc
    }, {}),
  )
  const [versions, setVersions] = useState([])
  const [selectedVersionId, setSelectedVersionId] = useState(null)

  const handleChange = (key, value) => {
    setMemoValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    const timestamp = new Date().toLocaleString()
    const snapshot = {
      id: `${Date.now()}`,
      createdAt: timestamp,
      sections: { ...memoValues },
    }
    setVersions((prev) => [snapshot, ...prev])
    setSelectedVersionId(snapshot.id)
  }

  const selectedVersion = useMemo(
    () => versions.find((version) => version.id === selectedVersionId) ?? null,
    [selectedVersionId, versions],
  )

  return (
    <div className="memo-page">
      <header className="page-header">
        <div>
          <p className="eyebrow">Investment Memo</p>
          <h1>IC Memo</h1>
          <p>Document diligence learnings, risks, and open questions.</p>
        </div>
        <div className="button-stack">
          <button type="button" className="primary-btn" onClick={handleSave}>
            Save new version
          </button>
          <Link className="ghost-link" to="/deals">
            Back to Pipeline
          </Link>
        </div>
      </header>

      <div className="memo-layout">
        <section className="memo-editor">
          <h2>Draft</h2>
          {SECTIONS.map((section) => (
            <label key={section.key}>
              <span>{section.label}</span>
              <textarea
                value={memoValues[section.key]}
                onChange={(event) => handleChange(section.key, event.target.value)}
                placeholder={`Add ${section.label.toLowerCase()} notes...`}
              />
            </label>
          ))}
        </section>

        <aside className="memo-history">
          <h2>Version History</h2>
          {versions.length === 0 && <p className="empty-state">No versions yet.</p>}
          <ul>
            {versions.map((version) => (
              <li key={version.id}>
                <button
                  type="button"
                  className={version.id === selectedVersionId ? 'active' : ''}
                  onClick={() => setSelectedVersionId(version.id)}
                >
                  <span>Version saved</span>
                  <strong>{version.createdAt}</strong>
                </button>
              </li>
            ))}
          </ul>

          {selectedVersion && (
            <div className="memo-preview">
              <h3>Viewing</h3>
              {SECTIONS.map((section) => (
                <article key={section.key}>
                  <h4>{section.label}</h4>
                  <p>{selectedVersion.sections[section.key] || '—'}</p>
                </article>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}

export default Memo
