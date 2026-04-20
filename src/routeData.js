// London Marathon route — hand-curated lat/lng waypoints approximating the official course.
// Starts at the Blue Start (Shooter's Hill Road, Blackheath), finishes on The Mall.
// Coordinates in [lng, lat] order (GeoJSON convention). Cumulative mile distances computed at runtime.

// Each point is [lng, lat]. Dense enough to render recognizable geometry at ~1:25k zoom.
window.LONDON_MARATHON_ROUTE = [
  // Start — Blue Start, Shooter's Hill Road, Blackheath
  [0.01650, 51.46820],
  [0.01380, 51.46760],
  [0.01120, 51.46710],
  [0.00880, 51.46680],
  // Heading east toward Charlton / Woolwich along Charlton Park Lane
  [0.00640, 51.46700],
  [0.00430, 51.46760],
  [0.00210, 51.46850],
  [0.00050, 51.46960],
  [0.00180, 51.47080],
  [0.00380, 51.47180],
  // Mile 2 area — Woolwich merge near Royal Artillery Barracks
  [0.00560, 51.47250],
  [0.00720, 51.47340],
  [0.00840, 51.47450],
  // Turning back west along Woolwich / Artillery Place
  [0.00620, 51.47510],
  [0.00340, 51.47590],
  [0.00080, 51.47670],
  [-0.00220, 51.47760],
  // Charlton, heading toward Greenwich along Woolwich Road / Trafalgar Road
  [-0.00540, 51.47830],
  [-0.00880, 51.47880],
  [-0.01240, 51.47900],
  [-0.01620, 51.47880],
  [-0.02020, 51.47840],
  [-0.02430, 51.47800],
  [-0.02860, 51.47780],
  // Mile 5-6 — approaching Cutty Sark / Greenwich
  [-0.03280, 51.47780],
  [-0.03680, 51.47790],
  [-0.04080, 51.47830],
  [-0.04480, 51.47870],
  [-0.04880, 51.47900],
  // Cutty Sark, Greenwich — Mile 6.5
  [-0.05240, 51.47940],
  [-0.05620, 51.47990],
  [-0.05940, 51.48060],
  // Creek Road, into Deptford
  [-0.06240, 51.48150],
  [-0.06480, 51.48220],
  [-0.06680, 51.48280],
  [-0.06880, 51.48310],
  // Deptford / Evelyn Street
  [-0.07080, 51.48340],
  [-0.07280, 51.48410],
  [-0.07440, 51.48500],
  [-0.07580, 51.48590],
  [-0.07680, 51.48680],
  // Surrey Quays / Rotherhithe loop — Mile 9
  [-0.07740, 51.48780],
  [-0.07740, 51.48880],
  [-0.07680, 51.48970],
  [-0.07560, 51.49050],
  [-0.07380, 51.49110],
  [-0.07180, 51.49140],
  [-0.06960, 51.49130],
  [-0.06740, 51.49090],
  // Swinging around Surrey Quays toward Rotherhithe
  [-0.06560, 51.49020],
  [-0.06440, 51.48930],
  [-0.06380, 51.48830],
  [-0.06400, 51.48730],
  [-0.06480, 51.48650],
  [-0.06600, 51.48600],
  [-0.06740, 51.48590],
  [-0.06880, 51.48620],
  // Rotherhithe / Jamaica Road
  [-0.06980, 51.48720],
  [-0.07060, 51.48830],
  [-0.07160, 51.48930],
  [-0.07280, 51.49020],
  [-0.07440, 51.49090],
  // Bermondsey / Jamaica Road — Mile 11
  [-0.07620, 51.49140],
  [-0.07820, 51.49180],
  [-0.08020, 51.49220],
  [-0.08220, 51.49250],
  [-0.08420, 51.49280],
  [-0.08640, 51.49300],
  [-0.08860, 51.49320],
  [-0.09080, 51.49340],
  // Approaching Tower Bridge from south — Mile 12
  [-0.09280, 51.49370],
  [-0.09400, 51.49420],
  [-0.09500, 51.49490],
  [-0.09580, 51.49570],
  [-0.09620, 51.49660],
  [-0.09620, 51.49760],
  // Tower Bridge crossing — Mile 12.25 ~
  [-0.07540, 51.50430],
  [-0.07440, 51.50510],
  // Onto The Highway — eastward
  [-0.07280, 51.50540],
  [-0.07060, 51.50570],
  [-0.06820, 51.50600],
  [-0.06560, 51.50630],
  [-0.06280, 51.50660],
  [-0.06000, 51.50690],
  // Wapping / The Highway — Mile 14
  [-0.05700, 51.50720],
  [-0.05400, 51.50740],
  [-0.05100, 51.50750],
  [-0.04800, 51.50760],
  [-0.04500, 51.50770],
  [-0.04200, 51.50780],
  // Limehouse Link area
  [-0.03900, 51.50790],
  [-0.03600, 51.50800],
  [-0.03300, 51.50800],
  [-0.03000, 51.50780],
  // Turning south into Isle of Dogs via Westferry Road
  [-0.02750, 51.50720],
  [-0.02620, 51.50620],
  [-0.02560, 51.50500],
  [-0.02540, 51.50360],
  [-0.02560, 51.50220],
  // Isle of Dogs west side — Mile 16
  [-0.02620, 51.50080],
  [-0.02720, 51.49940],
  [-0.02840, 51.49810],
  [-0.02960, 51.49680],
  [-0.03060, 51.49550],
  [-0.03100, 51.49420],
  // Mudchute — Mile 17
  [-0.03060, 51.49290],
  [-0.02960, 51.49180],
  [-0.02800, 51.49090],
  [-0.02620, 51.49040],
  [-0.02420, 51.49030],
  // Turn north into Canary Wharf
  [-0.02230, 51.49070],
  [-0.02080, 51.49140],
  [-0.01970, 51.49230],
  [-0.01900, 51.49330],
  // Canary Wharf core — Mile 18.5
  [-0.01870, 51.49430],
  [-0.01880, 51.49530],
  [-0.01940, 51.49620],
  [-0.02050, 51.49700],
  [-0.02200, 51.49760],
  [-0.02380, 51.49790],
  [-0.02580, 51.49800],
  // Heading back west via Poplar High Street — Mile 20
  [-0.02800, 51.49820],
  [-0.03040, 51.49830],
  [-0.03300, 51.49840],
  [-0.03580, 51.49850],
  [-0.03880, 51.49860],
  [-0.04200, 51.49870],
  [-0.04540, 51.49880],
  // Commercial Road / Limehouse — Mile 21
  [-0.04880, 51.49890],
  [-0.05220, 51.49900],
  [-0.05560, 51.49910],
  [-0.05900, 51.49920],
  [-0.06240, 51.49930],
  // Back onto The Highway heading west toward Tower
  [-0.06580, 51.49920],
  [-0.06880, 51.49900],
  [-0.07140, 51.49870],
  [-0.07360, 51.49830],
  // East Smithfield / Tower Hill — Mile 22.5
  [-0.07560, 51.49790],
  [-0.07700, 51.49770],
  [-0.07820, 51.49780],
  [-0.07920, 51.49810],
  // Tower of London / Lower Thames Street — Mile 23
  [-0.08050, 51.49880],
  [-0.08200, 51.49980],
  [-0.08380, 51.50070],
  [-0.08580, 51.50140],
  [-0.08800, 51.50200],
  [-0.09040, 51.50260],
  // Upper Thames Street / Blackfriars
  [-0.09280, 51.50310],
  [-0.09540, 51.50350],
  [-0.09820, 51.50390],
  [-0.10100, 51.50410],
  [-0.10380, 51.50440],
  // Victoria Embankment — Mile 24-25
  [-0.10660, 51.50460],
  [-0.10940, 51.50490],
  [-0.11220, 51.50520],
  [-0.11500, 51.50550],
  [-0.11780, 51.50580],
  [-0.12060, 51.50600],
  // Approaching Westminster Bridge — Mile 25
  [-0.12300, 51.50610],
  [-0.12480, 51.50580],
  [-0.12580, 51.50530],
  // Great George Street / Parliament Square
  [-0.12680, 51.50060],
  [-0.12780, 51.50040],
  [-0.12880, 51.50060],
  // Birdcage Walk toward Buckingham Palace
  [-0.13080, 51.50090],
  [-0.13380, 51.50100],
  [-0.13680, 51.50100],
  [-0.13980, 51.50110],
  [-0.14180, 51.50130],
  // Around Queen Victoria Memorial
  [-0.14200, 51.50190],
  [-0.14140, 51.50230],
  // The Mall — finish
  [-0.13880, 51.50320],
  [-0.13600, 51.50370],
  [-0.13320, 51.50410],
  [-0.13040, 51.50440],
  // Finish line on The Mall
  [-0.12820, 51.50460]
];

// Compute cumulative distance along the route (in miles). Scales raw polyline
// length to exactly 26.2 miles so mile markers land in credible places.
(function() {
  const pts = window.LONDON_MARATHON_ROUTE;
  const R_MI = 3958.756; // Earth radius in miles
  function hav(a, b) {
    const toRad = (d) => d * Math.PI / 180;
    const dLat = toRad(b[1] - a[1]);
    const dLng = toRad(b[0] - a[0]);
    const lat1 = toRad(a[1]), lat2 = toRad(b[1]);
    const h = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)**2;
    return 2 * R_MI * Math.asin(Math.sqrt(h));
  }
  const segs = [];
  let raw = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const d = hav(pts[i], pts[i+1]);
    segs.push(d);
    raw += d;
  }
  const TARGET = 26.2;
  const scale = TARGET / raw;
  const cum = [0];
  for (let i = 0; i < segs.length; i++) cum.push(cum[cum.length-1] + segs[i] * scale);
  window.LONDON_MARATHON_CUMULATIVE_MI = cum; // cum[i] = miles from start to pts[i]
  window.LONDON_MARATHON_TOTAL_MI = TARGET;
})();

// Given miles from start, return [lng, lat] by interpolating along the polyline.
window.positionAtMile = function(mile) {
  const pts = window.LONDON_MARATHON_ROUTE;
  const cum = window.LONDON_MARATHON_CUMULATIVE_MI;
  if (mile <= 0) return pts[0].slice();
  if (mile >= cum[cum.length-1]) return pts[pts.length-1].slice();
  // binary search
  let lo = 0, hi = cum.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cum[mid] <= mile) lo = mid; else hi = mid;
  }
  const t = (mile - cum[lo]) / (cum[hi] - cum[lo]);
  const a = pts[lo], b = pts[hi];
  return [a[0] + (b[0]-a[0])*t, a[1] + (b[1]-a[1])*t];
};

// Key landmarks keyed by mile — for table highlights and overlay labels
window.LONDON_MARATHON_LANDMARKS = {
  0:   'Blue Start · Blackheath',
  3:   'Routes merge · Woolwich',
  6.5: 'Cutty Sark · Greenwich',
  9:   'Surrey Quays',
  12:  'Tower Bridge',
  13.1:'Half marathon',
  14:  'Shadwell · The Highway',
  16:  'Mudchute · Isle of Dogs',
  18.5:'Canary Wharf',
  21:  'Limehouse · Rainbow Row',
  22.5:'Tower of London',
  24:  'Victoria Embankment',
  25:  'Big Ben · Westminster',
  26.2:'Finish · The Mall'
};
