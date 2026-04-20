/* global React, L */
const { useEffect, useRef } = React;

// ============ Map component ============
function MarathonMap({ runners, timeOfDay, mapStyle }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const runnerLayer = useRef(null);
  const staticLayer = useRef(null);

  // Init map
  useEffect(() => {
    if (mapInstance.current) return;
    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
      preferCanvas: false
    }).setView([51.5010, -0.0550], 12);
    mapInstance.current = map;

    staticLayer.current = L.layerGroup().addTo(map);
    runnerLayer.current = L.layerGroup().addTo(map);

    // Fit to route
    const bounds = L.latLngBounds(LONDON_MARATHON_ROUTE.map(p => [p[1], p[0]]));
    map.fitBounds(bounds, { padding: [40, 40] });

    // Resize handler
    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    // Initial invalidate after mount
    setTimeout(onResize, 50);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Basemap switch
  useEffect(() => {
    const map = mapInstance.current;
    if (!map) return;
    if (map._currentTileLayer) map.removeLayer(map._currentTileLayer);
    let url, attribution;
    if (mapStyle === 'dark') {
      url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
      attribution = '© OSM · CARTO';
    } else if (mapStyle === 'positron') {
      url = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
      attribution = '© OSM · CARTO';
    } else {
      url = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png';
      attribution = '© OSM · CARTO';
    }
    const tl = L.tileLayer(url, {
      attribution, subdomains: 'abcd', maxZoom: 19, tileSize: 256
    }).addTo(map);
    map._currentTileLayer = tl;
  }, [mapStyle]);

  // Draw static route + markers once
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !staticLayer.current) return;
    staticLayer.current.clearLayers();

    const latlngs = LONDON_MARATHON_ROUTE.map(p => [p[1], p[0]]);
    // Background white casing
    L.polyline(latlngs, {
      color: 'white', weight: 11, opacity: 0.95, lineCap: 'round', lineJoin: 'round'
    }).addTo(staticLayer.current);
    // Route line
    const routeColor = getComputedStyle(document.documentElement).getPropertyValue('--route').trim() || '#2b6cb0';
    L.polyline(latlngs, {
      color: routeColor, weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round'
    }).addTo(staticLayer.current);

    // Mile markers 1..26
    for (let m = 1; m <= 26; m++) {
      const pos = positionAtMile(m);
      const ll = [pos[1], pos[0]];
      L.marker(ll, {
        icon: L.divIcon({
          className: '',
          html: '<div class="mile-marker-dot"></div>',
          iconSize: [8, 8]
        }),
        interactive: false
      }).addTo(staticLayer.current);
      // Label every 5 miles + important spots
      if (m % 5 === 0 || m === 13) {
        L.marker(ll, {
          icon: L.divIcon({
            className: '',
            html: '<div class="mile-marker-label">MI ' + m + '</div>',
            iconSize: [0, 0]
          }),
          interactive: false,
          zIndexOffset: 400
        }).addTo(staticLayer.current);
      }
    }

    // Start & Finish flags
    const startPos = positionAtMile(0);
    L.marker([startPos[1], startPos[0]], {
      icon: L.divIcon({
        className: '',
        html: '<div class="flag-marker">Start</div>',
        iconSize: [0, 0]
      }),
      zIndexOffset: 600
    }).addTo(staticLayer.current);

    const finishPos = positionAtMile(26.2);
    L.marker([finishPos[1], finishPos[0]], {
      icon: L.divIcon({
        className: '',
        html: '<div class="flag-marker finish">Finish</div>',
        iconSize: [0, 0]
      }),
      zIndexOffset: 600
    }).addTo(staticLayer.current);

    // Key landmarks
    const keyLandmarks = [
      [6.5, 'Cutty Sark'],
      [12, 'Tower Bridge'],
      [18.5, 'Canary Wharf'],
      [22.5, 'Tower of London'],
      [25, 'Big Ben']
    ];
    keyLandmarks.forEach(([mi, label]) => {
      const pos = positionAtMile(mi);
      L.marker([pos[1], pos[0]], {
        icon: L.divIcon({
          className: '',
          html: '<div class="landmark-marker">' + label + '</div>',
          iconSize: [0, 0]
        }),
        interactive: false,
        zIndexOffset: 300
      }).addTo(staticLayer.current);
    });
  }, [mapStyle]);

  // Draw runner positions — updates on every slider tick
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !runnerLayer.current) return;
    runnerLayer.current.clearLayers();

    runners.forEach((runner, idx) => {
      const info = MM.milesAt(runner, timeOfDay);
      if (!info || info.status === 'pre') return;
      const color = runner.color || MM.colorFor(idx);

      // Three positions: best (ahead), middle, worst (behind)
      const positions = [
        { mi: info.best, key: 'best', rank: 2 },
        { mi: info.middle, key: 'middle', rank: 1 },
        { mi: info.worst, key: 'worst', rank: 0 }
      ];

      // Draw "uncertainty band" polyline between best and worst
      if (info.status !== 'finished') {
        const bandPts = [];
        const cum = LONDON_MARATHON_CUMULATIVE_MI;
        // sample polyline pts between worst and best miles
        for (let i = 0; i < cum.length; i++) {
          if (cum[i] >= info.worst && cum[i] <= info.best) {
            bandPts.push([LONDON_MARATHON_ROUTE[i][1], LONDON_MARATHON_ROUTE[i][0]]);
          }
        }
        // add endpoints
        const worstPos = positionAtMile(info.worst);
        const bestPos = positionAtMile(info.best);
        bandPts.unshift([worstPos[1], worstPos[0]]);
        bandPts.push([bestPos[1], bestPos[0]]);
        if (bandPts.length > 1) {
          L.polyline(bandPts, {
            color: color, weight: 6, opacity: 0.35, lineCap: 'round'
          }).addTo(runnerLayer.current);
        }
      }

      positions.forEach((p) => {
        if (p.mi <= 0) return;
        const pos = positionAtMile(p.mi);
        const ll = [pos[1], pos[0]];
        const opacity = p.key === 'middle' ? 1 : (p.key === 'best' ? 0.85 : 0.55);
        const size = p.key === 'middle' ? 16 : 12;
        const html = `
          <div style="position:relative;width:${size}px;height:${size}px;transform:translate(-50%,-50%);">
            <div style="
              width:${size}px;height:${size}px;
              border-radius:50%;
              background:${color};
              border:2px solid white;
              box-shadow:0 0 0 1px rgba(0,0,0,0.2), 0 2px 4px rgba(0,0,0,0.2);
              opacity:${opacity};
            "></div>
            ${p.key === 'middle' ? `<div style="
              position:absolute;top:-4px;left:50%;transform:translate(-50%,-100%);
              background:${color};color:white;
              padding:2px 7px;border-radius:4px;
              font-size:10px;font-weight:600;white-space:nowrap;
              font-family:var(--sans, sans-serif);
              box-shadow:0 1px 3px rgba(0,0,0,0.2);
            ">${runner.name || 'Runner'}</div>` : ''}
          </div>`;
        L.marker(ll, {
          icon: L.divIcon({ className: '', html, iconSize: [0, 0] }),
          zIndexOffset: p.key === 'middle' ? 800 : 700,
          interactive: false
        }).addTo(runnerLayer.current);
      });
    });
  }, [runners, timeOfDay]);

  return React.createElement('div', { id: 'map', ref: mapRef });
}

window.MarathonMap = MarathonMap;
