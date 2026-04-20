/* global React, L */
const { useEffect, useRef } = React;

function MarathonMap({ runners, timeOfDay }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const runnerLayer = useRef(null);
  const staticLayer = useRef(null);
  // Keep a live ref to runners so static-layer tooltip functions always see current data
  const runnersRef = useRef(runners);
  useEffect(() => { runnersRef.current = runners; }, [runners]);

  // Init map once
  useEffect(() => {
    if (mapInstance.current) return;
    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
      preferCanvas: false
    }).setView([51.500, -0.055], 12);
    mapInstance.current = map;

    staticLayer.current = L.layerGroup().addTo(map);
    runnerLayer.current = L.layerGroup().addTo(map);

    const bounds = L.latLngBounds(LONDON_MARATHON_ROUTE.map(p => [p[1], p[0]]));
    map.fitBounds(bounds, { padding: [48, 48] });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OSM · CARTO', subdomains: 'abcd', maxZoom: 19
    }).addTo(map);

    const onResize = () => map.invalidateSize();
    window.addEventListener('resize', onResize);
    setTimeout(onResize, 50);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Draw static route, mile dots, start/finish flags — once
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !staticLayer.current) return;
    staticLayer.current.clearLayers();

    const latlngs = LONDON_MARATHON_ROUTE.map(p => [p[1], p[0]]);

    // Route — white casing then blue line
    L.polyline(latlngs, { color: 'white', weight: 11, opacity: 0.95, lineCap: 'round', lineJoin: 'round' })
      .addTo(staticLayer.current);
    L.polyline(latlngs, { color: '#2b6cb0', weight: 5, opacity: 0.85, lineCap: 'round', lineJoin: 'round' })
      .addTo(staticLayer.current);

    // Mile dots — tooltip built dynamically from runnersRef so it always reflects
    // the current runner list without needing to redraw the static layer
    const mileDotIcon = L.divIcon({
      className: '',
      html: '<div style="width:8px;height:8px;border-radius:50%;background:#fff;border:1.5px solid #4a5159;box-sizing:border-box;"></div>',
      iconSize: [8, 8],
      iconAnchor: [4, 4]
    });

    function buildMileTooltip(mile) {
      const rs = runnersRef.current;
      let html = `<div class="mile-tooltip-inner"><div class="mtt-mile">Mile ${mile === 26.2 ? '26.2 — Finish' : mile}</div>`;
      const valid = rs.filter(r => MM.timeAtMile(r, mile));
      if (valid.length > 0) {
        html += `<div class="mtt-header"><span></span><span>Best</span><span>Avg</span><span>Worst</span></div>`;
        valid.forEach(r => {
          const t = MM.timeAtMile(r, mile);
          const avg = (t.earliest + t.latest) / 2;
          const c = r.color || '#888';
          html +=
            `<div class="mtt-row">` +
            `<span class="mtt-swatch" style="background:${c}"></span>` +
            `<span class="mtt-name">${r.name || 'Runner'}</span>` +
            `<span class="mtt-time">${MM.fmtTimeOfDay(t.earliest)}</span>` +
            `<span class="mtt-time">${MM.fmtTimeOfDay(avg)}</span>` +
            `<span class="mtt-time mtt-worst">${MM.fmtTimeOfDay(t.latest)}</span>` +
            `</div>`;
        });
      }
      html += '</div>';
      return html;
    }

    for (let m = 1; m <= 26; m++) {
      const pos = positionAtMile(m);
      L.marker([pos[1], pos[0]], {
        icon: mileDotIcon, interactive: true, zIndexOffset: 100
      }).bindTooltip(() => buildMileTooltip(m), {
        direction: 'top', offset: [0, -6], className: 'mile-tooltip'
      }).addTo(staticLayer.current);
    }
    // Finish dot (26.2)
    const finishPos = positionAtMile(26.2);
    L.marker([finishPos[1], finishPos[0]], {
      icon: mileDotIcon, interactive: true, zIndexOffset: 100
    }).bindTooltip(() => buildMileTooltip(26.2), {
      direction: 'top', offset: [0, -6], className: 'mile-tooltip'
    }).addTo(staticLayer.current);

    // Start flag
    const startPos = positionAtMile(0);
    L.marker([startPos[1], startPos[0]], {
      icon: L.divIcon({ className: 'mm-label', html: '<div class="flag-marker">Start</div>', iconSize: [0, 0], iconAnchor: [0, 0] }),
      zIndexOffset: 600
    }).addTo(staticLayer.current);

    // Finish flag
    L.marker([finishPos[1], finishPos[0]], {
      icon: L.divIcon({ className: 'mm-label', html: '<div class="flag-marker finish">Finish</div>', iconSize: [0, 0], iconAnchor: [0, 0] }),
      zIndexOffset: 600
    }).addTo(staticLayer.current);
  }, []);

  // Update runner markers on every tick
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !runnerLayer.current) return;
    runnerLayer.current.clearLayers();

    runners.forEach((runner, idx) => {
      const info = MM.milesAt(runner, timeOfDay);
      if (!info || info.status === 'pre') return;
      const color = runner.color || MM.colorFor(idx);

      // Uncertainty band
      if (info.status !== 'finished') {
        const cum = LONDON_MARATHON_CUMULATIVE_MI;
        const bandPts = [];
        for (let i = 0; i < cum.length; i++) {
          if (cum[i] >= info.worst && cum[i] <= info.best) {
            bandPts.push([LONDON_MARATHON_ROUTE[i][1], LONDON_MARATHON_ROUTE[i][0]]);
          }
        }
        const wp = positionAtMile(info.worst);
        const bp = positionAtMile(info.best);
        bandPts.unshift([wp[1], wp[0]]);
        bandPts.push([bp[1], bp[0]]);
        if (bandPts.length > 1) {
          L.polyline(bandPts, { color, weight: 6, opacity: 0.65, lineCap: 'round' })
            .addTo(runnerLayer.current);
        }
      }

      const elapsedStr = MM.fmtDuration(info.elapsed);
      const todStr = MM.fmtTimeOfDay(timeOfDay);

      [
        { mi: info.best,   key: 'best',   label: 'Best',     size: 12 },
        { mi: info.middle, key: 'middle', label: 'Expected', size: 16 },
        { mi: info.worst,  key: 'worst',  label: 'Worst',    size: 12 }
      ].forEach(p => {
        if (p.mi <= 0) return;
        const pos = positionAtMile(p.mi);
        const ll = [pos[1], pos[0]];
        const opacity = p.key === 'middle' ? 1 : (p.key === 'best' ? 0.85 : 0.55);
        const anchor = p.size / 2;

        const nameTag = p.key === 'middle'
          ? `<div style="position:absolute;bottom:${p.size + 4}px;left:50%;transform:translateX(-50%);background:${color};color:white;padding:2px 7px;border-radius:4px;font-size:10px;font-weight:600;white-space:nowrap;font-family:var(--sans,sans-serif);box-shadow:0 1px 3px rgba(0,0,0,0.2);pointer-events:none;">${runner.name || 'Runner'}</div>`
          : '';

        const html = `<div style="position:relative;width:${p.size}px;height:${p.size}px;">
          <div style="width:${p.size}px;height:${p.size}px;border-radius:50%;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.2),0 2px 4px rgba(0,0,0,0.2);opacity:${opacity};"></div>
          ${nameTag}
        </div>`;

        const tooltipHtml =
          `<div class="runner-tooltip-inner">` +
          `<div class="rtt-name">${runner.name || 'Runner'}</div>` +
          `<div class="rtt-row"><span class="rtt-label">${p.label}</span><span>Mile ${p.mi.toFixed(1)}</span></div>` +
          `<div class="rtt-row"><span class="rtt-label">Elapsed</span><span>${elapsedStr}</span></div>` +
          `<div class="rtt-row"><span class="rtt-label">Time</span><span>${todStr}</span></div>` +
          `</div>`;

        L.marker(ll, {
          icon: L.divIcon({ className: '', html, iconSize: [p.size, p.size], iconAnchor: [anchor, anchor] }),
          zIndexOffset: p.key === 'middle' ? 800 : 700,
          interactive: true
        }).bindTooltip(tooltipHtml, {
          direction: 'top',
          offset: [0, -(anchor + 6)],
          className: 'runner-tooltip'
        }).addTo(runnerLayer.current);
      });
    });
  }, [runners, timeOfDay]);

  return React.createElement('div', { id: 'map', ref: mapRef });
}

window.MarathonMap = MarathonMap;
