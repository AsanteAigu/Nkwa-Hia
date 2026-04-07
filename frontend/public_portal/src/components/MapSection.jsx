import { useEffect, useRef, useState } from 'react'
import { Layers, Navigation, RefreshCw } from 'lucide-react'
import { STATUS_COLORS } from '../App'

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

// Creates a teardrop SVG pin matching the v3.0 design spec
function createMarkerSvg(status) {
  const c = STATUS_COLORS[status] || STATUS_COLORS.RED
  const dot = c.dot
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="42" viewBox="0 0 32 42">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${dot}" flood-opacity="0.45"/>
        </filter>
      </defs>
      <!-- Outer pin -->
      <path d="M16 2C9.37 2 4 7.37 4 14c0 9.75 12 26 12 26s12-16.25 12-26C28 7.37 22.63 2 16 2z"
            fill="white" filter="url(#shadow)"/>
      <!-- Inner coloured fill -->
      <path d="M16 5C11.03 5 7 9.03 7 14c0 7.59 9 20 9 20s9-12.41 9-20C25 9.03 20.97 5 16 5z"
            fill="${dot}"/>
      <!-- White cross -->
      <rect x="14.5" y="9" width="3" height="10" rx="1" fill="white"/>
      <rect x="11" y="12.5" width="10" height="3" rx="1" fill="white"/>
    </svg>
  `.trim()
}

let mapsLoaded = false
let mapsLoadPromise = null

function loadGoogleMaps() {
  if (mapsLoaded) return Promise.resolve()
  if (mapsLoadPromise) return mapsLoadPromise
  mapsLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=visualization&callback=__gehgMapsInit`
    script.async = true
    script.defer = true
    window.__gehgMapsInit = () => {
      mapsLoaded = true
      resolve()
    }
    script.onerror = reject
    document.head.appendChild(script)
  })
  return mapsLoadPromise
}

export default function MapSection({
  hospitals, loading, error,
  wardFilter, setWardFilter,
  showHeatmap, setShowHeatmap,
  statusCounts, onSelectHospital,
  onRefresh, userCoords, onNearMe,
  lastRefreshed,
}) {
  const mapRef       = useRef(null)
  const gmapRef      = useRef(null)
  const markersRef   = useRef([])
  const heatLayersRef = useRef({})
  const [mapReady, setMapReady]   = useState(false)
  const [mapError, setMapError]   = useState(null)

  // Load Google Maps script once
  useEffect(() => {
    loadGoogleMaps()
      .then(() => setMapReady(true))
      .catch(err => {
        console.error('Maps failed to load:', err)
        setMapError('Failed to load Google Maps.')
      })
  }, [])

  // Init map once script is ready
  useEffect(() => {
    if (!mapReady || !mapRef.current || gmapRef.current) return
    try {
      gmapRef.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 5.6037, lng: -0.1870 },
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
        styles: [
          { featureType: 'water', stylers: [{ color: '#c5dff0' }] },
          { featureType: 'landscape', stylers: [{ color: '#f5f8fc' }] },
          { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#dde8f4' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#4a6080' }] },
        ],
      })
    } catch (e) {
      setMapError('Map initialisation failed.')
    }
  }, [mapReady])

  // Render markers — hidden when heatmap is active
  useEffect(() => {
    if (!gmapRef.current || !mapReady || !window.google) return

    // Clear old markers
    markersRef.current.forEach(m => m.setMap(null))
    markersRef.current = []

    // When heatmap is on, don't render any pin markers
    if (showHeatmap) return

    const filtered = wardFilter === 'ALL'
      ? hospitals
      : hospitals.filter(h =>
          h.active_wards?.some(w => w.ward_type === wardFilter)
        )

    filtered.forEach(hospital => {
      if (!hospital.location) return
      const svgString = createMarkerSvg(hospital.status)
      const icon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString),
        scaledSize: new window.google.maps.Size(32, 42),
        anchor: new window.google.maps.Point(16, 42),
      }
      const marker = new window.google.maps.Marker({
        position: { lat: hospital.location.lat, lng: hospital.location.lng },
        map: gmapRef.current,
        title: hospital.name,
        icon,
      })
      marker.addListener('click', () => onSelectHospital(hospital))
      markersRef.current.push(marker)
    })
  }, [hospitals, wardFilter, mapReady, showHeatmap])

  // Heatmap layers — deep saturated colors, no markers when active
  useEffect(() => {
    if (!gmapRef.current || !mapReady || !window.google?.maps?.visualization) return

    // Rich multi-stop gradients for deep, vivid colors
    const STATUS_GRADIENT = {
      GREEN:  ['rgba(0,0,0,0)', 'rgba(46,125,50,0.4)', 'rgba(27,94,32,0.85)', '#1B5E20'],
      YELLOW: ['rgba(0,0,0,0)', 'rgba(249,168,37,0.4)', 'rgba(230,130,0,0.85)', '#E65100'],
      ORANGE: ['rgba(0,0,0,0)', 'rgba(230,81,0,0.4)', 'rgba(191,54,12,0.85)', '#BF360C'],
      RED:    ['rgba(0,0,0,0)', 'rgba(211,47,47,0.4)', 'rgba(183,28,28,0.85)', '#7F0000'],
    }

    const byStatus = { GREEN: [], YELLOW: [], ORANGE: [], RED: [] }
    const filtered = wardFilter === 'ALL'
      ? hospitals
      : hospitals.filter(h => h.active_wards?.some(w => w.ward_type === wardFilter))

    filtered.forEach(h => {
      if (h.location && byStatus[h.status]) {
        byStatus[h.status].push(new window.google.maps.LatLng(h.location.lat, h.location.lng))
      }
    })

    Object.entries(STATUS_GRADIENT).forEach(([status, gradient]) => {
      if (heatLayersRef.current[status]) {
        heatLayersRef.current[status].setData(byStatus[status])
        heatLayersRef.current[status].setMap(showHeatmap ? gmapRef.current : null)
        if (showHeatmap) {
          heatLayersRef.current[status].set('radius', 70)
          heatLayersRef.current[status].set('opacity', 1.0)
          heatLayersRef.current[status].set('maxIntensity', 2)
        }
      } else {
        heatLayersRef.current[status] = new window.google.maps.visualization.HeatmapLayer({
          data: byStatus[status],
          map: showHeatmap ? gmapRef.current : null,
          radius: 70,
          opacity: 1.0,
          maxIntensity: 2,
          gradient,
        })
      }
    })
  }, [hospitals, showHeatmap, wardFilter, mapReady])

  // Near Me
  function handleNearMe() {
    onNearMe()
    if (gmapRef.current && userCoords) {
      gmapRef.current.panTo(userCoords)
      gmapRef.current.setZoom(14)
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const latlng = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        gmapRef.current?.panTo(latlng)
        gmapRef.current?.setZoom(14)
      })
    }
  }

  const wards = ['ALL', 'ICU', 'EMERGENCY', 'MATERNITY', 'PAEDIATRIC', 'SURGICAL', 'GENERAL']

  return (
    <div className="map-section">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Live Hospital Map</p>
          <h2 className="section-title">Greater Accra Facility Network</h2>
          <p className="section-subtitle">
            {loading ? 'Loading hospital data…' : `${hospitals.length} facilities tracked across Greater Accra. Click any marker to view details.`}
          </p>
        </div>

        {/* Toolbar */}
        <div className="map-toolbar">
          {/* Status count chips */}
          <div className="status-counts">
            {Object.entries(STATUS_COLORS).map(([key, c]) => (
              <span key={key} className="status-chip">
                <span className="status-dot" style={{ background: c.dot }} />
                {statusCounts[key] || 0} {c.text}
              </span>
            ))}
          </div>

          <div className="map-toolbar-actions">
            {/* Ward filter */}
            <div className="ward-filter">
              <span>Ward:</span>
              <select
                className="ward-select"
                value={wardFilter}
                onChange={e => setWardFilter(e.target.value)}
              >
                {wards.map(w => <option key={w} value={w}>{w === 'ALL' ? 'All Wards' : w}</option>)}
              </select>
            </div>

            {/* Near Me */}
            <button className="btn-toolbar" onClick={handleNearMe}>
              <Navigation size={14} />
              Near Me
            </button>

            {/* Heatmap toggle */}
            <button
              className={`btn-toolbar ${showHeatmap ? 'active' : ''}`}
              onClick={() => setShowHeatmap(v => !v)}
            >
              <Layers size={14} />
              {showHeatmap ? 'Heatmap On' : 'Strain Heatmap'}
            </button>

            {/* Refresh */}
            <button className="btn-toolbar" onClick={onRefresh} title="Refresh hospital data">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Map canvas */}
        <div className="map-canvas-wrapper">
          <div id="gmap" ref={mapRef} />

          {/* Loading overlay */}
          {(loading || (!mapReady && !mapError)) && (
            <div className="map-loading-overlay">
              <div className="spinner" />
              <span>{loading ? 'Fetching hospital data…' : 'Loading map…'}</span>
            </div>
          )}

          {/* Error overlay */}
          {mapError && (
            <div className="map-loading-overlay">
              <span style={{ color: 'var(--brand-red)' }}>⚠ {mapError}</span>
            </div>
          )}

          {error && !mapError && (
            <div style={{
              position: 'absolute', bottom: 12, left: 12, right: 12,
              background: '#FFEBEE', borderRadius: 8, padding: '10px 14px',
              fontSize: '0.82rem', color: '#B71C1C',
            }}>
              ⚠ Could not load hospital data from backend: {error}
            </div>
          )}
        </div>

        {/* Legend + live refresh indicator */}
        <div style={{ marginTop: 12, display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: '0.78rem', color: 'var(--text-muted)', alignItems: 'center' }}>
          <span>Click a marker for full hospital details.</span>
          <span>·</span>
          <span>Hospital staff bed updates appear here within 30 seconds.</span>
          {lastRefreshed && (
            <>
              <span>·</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4CAF50', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                Last synced {lastRefreshed.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
