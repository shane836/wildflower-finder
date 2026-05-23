import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [flowers, setFlowers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/wildflowers.json')
      .then(res => res.json())
      .then(data => {
        setFlowers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const filtered = flowers.filter(flower =>
    flower.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getEffortColor = (effort) => {
    if (effort === 'Easy') return '#4CAF50'
    if (effort === 'Moderate') return '#FFC107'
    return '#F44336'
  }

  if (loading) {
    return <div className="container"><p className="loading">Loading wildflowers…</p></div>
  }

  return (
    <div className="container">
      {!selected ? (
        <>
          <header className="header">
            <h1>🌸 Rabun County Wildflowers</h1>
            <p>Find native wildflowers perfect for beginners</p>
          </header>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="results-count">
            Showing {filtered.length} of {flowers.length} wildflowers
          </div>

          {filtered.length === 0 ? (
            <p className="no-results">No wildflowers found. Try another search!</p>
          ) : (
            <div className="grid">
              {filtered.map(flower => (
                <button
                  key={flower.id}
                  className="card"
                  onClick={() => setSelected(flower)}
                  type="button"
                >
                  <div className="card-image">
                    <img src={flower.imageUrl} alt={flower.name} loading="lazy" />
                  </div>
                  <div className="card-body">
                    <h3>{flower.name}</h3>
                    <p className="bloom">{flower.bloomSeason}</p>
                    <div className="effort-tags">
                      <span
                        className="effort-tag"
                        style={{ backgroundColor: getEffortColor(flower.effortToPlant) }}
                      >
                        Plant: {flower.effortToPlant}
                      </span>
                      <span
                        className="effort-tag"
                        style={{ backgroundColor: getEffortColor(flower.effortToMaintain) }}
                      >
                        Maintain: {flower.effortToMaintain}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="detail">
          <button className="back-button" onClick={() => setSelected(null)}>
            ← Back
          </button>

          <div className="detail-image">
            <img src={selected.imageUrl} alt={selected.name} />
          </div>

          <h2>{selected.name}</h2>

          <div className="detail-grid">
            <div className="detail-section">
              <label>Bloom Season</label>
              <p>{selected.bloomSeason}</p>
            </div>

            <div className="detail-section">
              <label>Sunlight</label>
              <p>{selected.sunlight}</p>
            </div>

            <div className="detail-section">
              <label>Water Needs</label>
              <p>{selected.waterNeeds}</p>
            </div>

            <div className="detail-section">
              <label>Effort to Plant</label>
              <p style={{ color: getEffortColor(selected.effortToPlant), fontWeight: 700 }}>
                {selected.effortToPlant}
              </p>
            </div>

            <div className="detail-section">
              <label>Effort to Maintain</label>
              <p style={{ color: getEffortColor(selected.effortToMaintain), fontWeight: 700 }}>
                {selected.effortToMaintain}
              </p>
            </div>

            <div className="detail-section full">
              <label>Notes</label>
              <p>{selected.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
