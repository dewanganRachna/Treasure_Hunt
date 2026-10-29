
import json, math, random

with open('src/game/geo/chhattisgarh.geo.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

coords = data['features'][0]['geometry']['coordinates'][0]

def dist_to_segment(p, a, b):
    abx = b[0] - a[0]
    aby = b[1] - a[1]
    apx = p[0] - a[0]
    apy = p[1] - a[1]
    ab_len_sq = abx * abx + aby * aby
    if ab_len_sq == 0:
        return math.hypot(apx, apy)
    t = max(0.0, min(1.0, (apx * abx + apy * aby) / ab_len_sq))
    proj_x = a[0] + t * abx
    proj_y = a[1] + t * aby
    return math.hypot(p[0] - proj_x, p[1] - proj_y)

def rdp(points, epsilon):
    dmax = 0.0
    index = 0
    for i in range(1, len(points) - 1):
        d = dist_to_segment(points[i], points[0], points[-1])
        if d > dmax:
            index = i
            dmax = d
    if dmax > epsilon:
        r1 = rdp(points[:index+1], epsilon)
        r2 = rdp(points[index:], epsilon)
        return r1[:-1] + r2
    return [points[0], points[-1]]

simplified = rdp(coords, 0.016)

lons = [pt[0] for pt in coords]
lats = [pt[1] for pt in coords]
min_lon, max_lon = min(lons), max(lons)
min_lat, max_lat = min(lats), max(lats)
center_lon = (min_lon + max_lon) / 2.0
center_lat = (min_lat + max_lat) / 2.0

WORLD_WIDTH = 2200
WORLD_HEIGHT = 1600
MAP_CENTER_X = 1100
MAP_CENTER_Y = 800
MAP_HEIGHT = 1200

cos_lat = math.cos(math.radians(center_lat))
scale_y = MAP_HEIGHT / (max_lat - min_lat)
scale_x = scale_y * cos_lat

def project(lon, lat):
    return (round(MAP_CENTER_X + (lon - center_lon) * scale_x, 1),
            round(MAP_CENTER_Y - (lat - center_lat) * scale_y, 1))

poly_proj = [project(pt[0], pt[1]) for pt in simplified]

def point_in_poly(x, y, poly):
    n = len(poly)
    inside = False
    p1x, p1y = poly[0]
    for i in range(n + 1):
        p2x, p2y = poly[i % n]
        if y > min(p1y, p2y):
            if y <= max(p1y, p2y):
                if x <= max(p1x, p2x):
                    if p1y != p2y:
                        xinters = (y - p1y) * (p2x - p1x) / (p2y - p1y) + p1x
                    if p1x == p2x or x <= xinters:
                        inside = not inside
        p1x, p1y = p2x, p2y
    return inside

def min_dist_to_poly(p, poly):
    return min(dist_to_segment(p, poly[i], poly[(i+1)%len(poly)]) for i in range(len(poly)))

def smooth_closed_path(pts):
    n = len(pts)
    d = [f'M {pts[0][0]} {pts[0][1]}']
    for i in range(n):
        p0 = pts[(i - 1) % n]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n]
        c1x = p1[0] + (p2[0] - p0[0]) / 6.0
        c1y = p1[1] + (p2[1] - p0[1]) / 6.0
        c2x = p2[0] - (p3[0] - p1[0]) / 6.0
        c2y = p2[1] - (p3[1] - p1[1]) / 6.0
        d.append(f'C {c1x:.1f} {c1y:.1f}, {c2x:.1f} {c2y:.1f}, {p2[0]} {p2[1]}')
    d.append('Z')
    return ' '.join(d)

map_outline_path = smooth_closed_path(poly_proj)

depth = 34
poly_bottom = [(p[0], round(p[1] + depth, 1)) for p in poly_proj]
bottom_outline_path = smooth_closed_path(poly_bottom)

poly_shadow = [(p[0], round(p[1] + depth + 14, 1)) for p in poly_proj]
shadow_d = smooth_closed_path(poly_shadow)

cliff_facets = []
for i in range(len(poly_proj)):
    p1 = poly_proj[i]
    p2 = poly_proj[(i + 1) % len(poly_proj)]
    dx = p2[0] - p1[0]
    dy = p2[1] - p1[1]
    seg_len = math.hypot(dx, dy)
    if seg_len < 0.2:
        continue
    # In CCW screen coordinates (Y down), outward normal is (dy, -dx).
    # Normal points South (towards viewer) when -dx > 0 => dx < 0.
    # Include segments with dx <= 1.0 (all south, southeast, southwest facing edges)
    if dx < 1.0:
        nx = dy / seg_len
        ny = -dx / seg_len
        # Light from top-left NW
        light = -0.5 * nx - 0.7 * ny
        if light > 0.1:
            color = '#385440'
            border = '#4A6B52'
            shade = '#293E30'
        elif light > -0.25:
            color = '#2B4232'
            border = '#3A5642'
            shade = '#1F3024'
        else:
            color = '#1D2E22'
            border = '#293E30'
            shade = '#152119'
        facet_d = f'M {p1[0]} {p1[1]} L {p2[0]} {p2[1]} L {p2[0]} {p2[1]+depth} L {p1[0]} {p1[1]+depth} Z'
        cliff_facets.append({'d': facet_d, 'color': color, 'border': border, 'shade': shade})

cp_data = [
    {'id': 1, 'nameEn': 'Bastar Gateway', 'nameHi': 'बस्तर द्वार', 'region': 'Bastar Highlands', 'lat': 19.10, 'lon': 81.95},
    {'id': 2, 'nameEn': 'Kanker Valley', 'nameHi': 'कांकेर घाटी', 'region': 'Kanker Forest Belt', 'lat': 20.27, 'lon': 81.49},
    {'id': 3, 'nameEn': 'Dhamtari Waters', 'nameHi': 'धमतरी जलक्षेत्र', 'region': 'Mahanadi Headwaters', 'lat': 20.71, 'lon': 81.55},
    {'id': 4, 'nameEn': 'Raipur Central Hub', 'nameHi': 'रायपुर केंद्रीय हब', 'region': 'Capital Plains', 'lat': 21.25, 'lon': 81.63},
    {'id': 5, 'nameEn': 'Sirpur Heritage', 'nameHi': 'सिरपुर ऐतिहासिक क्षेत्र', 'region': 'Mahasamund Belt', 'lat': 21.20, 'lon': 82.10},
    {'id': 6, 'nameEn': 'Bilaspur City', 'nameHi': 'बिलासपुर नगर', 'region': 'Arpa Basin', 'lat': 22.08, 'lon': 82.15},
    {'id': 7, 'nameEn': 'Korba Valley', 'nameHi': 'कोरबा घाटी', 'region': 'Hasdeo Power Belt', 'lat': 22.35, 'lon': 82.68},
    {'id': 8, 'nameEn': 'Raigarh East', 'nameHi': 'रायगढ़ पूर्वी सीमा', 'region': 'Eastern Plateau', 'lat': 21.90, 'lon': 83.35},
    {'id': 9, 'nameEn': 'Jashpur Highlands', 'nameHi': 'जशपुर उच्चभूमि', 'region': 'Northeastern Hills', 'lat': 22.80, 'lon': 83.95},
    {'id': 10, 'nameEn': 'Ambikapur Summit', 'nameHi': 'अम्बिकापुर शिखर', 'region': 'Surguja Highlands', 'lat': 23.12, 'lon': 83.18}
]

checkpoints = []
for item in cp_data:
    px, py = project(item['lon'], item['lat'])
    checkpoints.append({
        'id': item['id'],
        'x': px,
        'y': py,
        'nameEn': item['nameEn'],
        'nameHi': item['nameHi'],
        'region': item['region']
    })

curvatures = [0.08, -0.08, 0.06, 0.05, -0.08, 0.06, 0.08, -0.12, -0.08]
route_segments = []
sampled_trail_points = []
for i in range(9):
    p0 = (checkpoints[i]['x'], checkpoints[i]['y'])
    p3 = (checkpoints[i+1]['x'], checkpoints[i+1]['y'])
    dx = p3[0] - p0[0]
    dy = p3[1] - p0[1]
    c = curvatures[i]
    perp_x = -dy * c
    perp_y = dx * c
    p1 = (p0[0] + dx * 0.33 + perp_x, p0[1] + dy * 0.33 + perp_y)
    p2 = (p0[0] + dx * 0.66 + perp_x, p0[1] + dy * 0.66 + perp_y)
    seg_d = f'M {p0[0]} {p0[1]} C {p1[0]:.1f} {p1[1]:.1f}, {p2[0]:.1f} {p2[1]:.1f}, {p3[0]} {p3[1]}'
    route_segments.append(seg_d)
    for step in range(30):
        t = step / 29.0
        sx = (1-t)**3 * p0[0] + 3*(1-t)**2*t * p1[0] + 3*(1-t)*t**2 * p2[0] + t**3 * p3[0]
        sy = (1-t)**3 * p0[1] + 3*(1-t)**2*t * p1[1] + 3*(1-t)*t**2 * p2[1] + t**3 * p3[1]
        sampled_trail_points.append((sx, sy))

# 4 Real Rivers
rivers = [
    {
        'name': 'Mahanadi',
        'width': 4.5,
        'd': 'M 966 845 C 970 810, 990 770, 1020 745 C 1070 720, 1140 700, 1220 660 C 1270 635, 1310 635, 1345 640'
    },
    {
        'name': 'Shivnath',
        'width': 3.2,
        'd': 'M 880 790 C 910 770, 935 750, 980 745 C 1010 740, 1040 720, 1060 705'
    },
    {
        'name': 'Hasdeo',
        'width': 3.2,
        'd': 'M 1110 360 C 1130 420, 1150 480, 1170 530 C 1160 580, 1140 640, 1120 680'
    },
    {
        'name': 'Indravati',
        'width': 3.8,
        'd': 'M 1110 1130 C 1050 1140, 1000 1150, 960 1155 C 920 1160, 880 1170, 850 1190'
    }
]

# 5 Cultural Landmarks (1-2% map width, away from checkpoints and route)
raw_landmarks = [
    {'id': 'chitrakote', 'name': 'Chitrakote Falls', 'hi': 'चित्रकोट जलप्रपात', 'lat': 19.20, 'lon': 81.70, 'type': 'waterfall'},
    {'id': 'sirpur', 'name': 'Sirpur Lakshmana Temple', 'hi': 'सिरपुर लक्ष्मण मंदिर', 'lat': 21.34, 'lon': 82.18, 'type': 'temple'},
    {'id': 'bhoramdeo', 'name': 'Bhoramdeo Temple', 'hi': 'भोरमदेव मंदिर', 'lat': 22.12, 'lon': 81.25, 'type': 'temple'},
    {'id': 'mainpat', 'name': 'Mainpat Highlands', 'hi': 'मैनपाट उच्चभूमि', 'lat': 22.81, 'lon': 83.28, 'type': 'hill'},
    {'id': 'bailadila', 'name': 'Bailadila Forest Peaks', 'hi': 'बैलाडीला पर्वत शिखर', 'lat': 18.68, 'lon': 81.23, 'type': 'hill'}
]

landmarks = []
for lm in raw_landmarks:
    px, py = project(lm['lon'], lm['lat'])
    landmarks.append({
        'id': lm['id'],
        'name': lm['name'],
        'hi': lm['hi'],
        'x': px,
        'y': py,
        'type': lm['type']
    })

# Seeded random trees with strict exclusion zones
rng = random.Random(42)
trees = []
attempts = 0
while len(trees) < 85 and attempts < 4000:
    attempts += 1
    rx = rng.uniform(750, 1450)
    ry = rng.uniform(250, 1380)
    if not point_in_poly(rx, ry, poly_proj):
        continue
    if min_dist_to_poly((rx, ry), poly_proj) < 24:
        continue
    if any(math.hypot(rx - cp['x'], ry - cp['y']) < 42 for cp in checkpoints):
        continue
    if any(math.hypot(rx - tp[0], ry - tp[1]) < 30 for tp in sampled_trail_points):
        continue
    if any(math.hypot(rx - lm['x'], ry - lm['y']) < 35 for lm in landmarks):
        continue
    if any(math.hypot(rx - t['x'], ry - t['y']) < 18 for t in trees):
        continue
    
    variant = rng.choice(['round', 'conifer', 'bush'])
    scale = round(rng.uniform(0.75, 1.15), 2)
    trees.append({'x': round(rx, 1), 'y': round(ry, 1), 'variant': variant, 'scale': scale})

# Contours clipped across North-Up Chhattisgarh
contours = [
    "M 1020 330 C 1120 310, 1240 320, 1360 300",
    "M 980 430 C 1100 420, 1220 400, 1380 430",
    "M 900 550 C 1040 540, 1180 520, 1340 560",
    "M 840 680 C 960 670, 1100 660, 1280 650",
    "M 820 800 C 940 780, 1060 790, 1220 770",
    "M 820 950 C 920 930, 1020 920, 1120 940",
    "M 780 1100 C 880 1080, 980 1090, 1080 1080",
    "M 840 1240 C 920 1220, 1000 1230, 1060 1220"
]

# Generate JS code
out = []
out.append('/**')
out.append(' * Chhattisgarh Digital Explorer - World & Map Data')
out.append(' * True North-Up, unrotated, unstretched boundary from official Survey GeoJSON.')
out.append(' * Source: DataMeet India / Survey of India state boundary.')
out.append(' */')
out.append('')
out.append('export const WORLD_WIDTH = 2200;')
out.append('export const WORLD_HEIGHT = 1600;')
out.append('export const STAGE_WIDTH = 1920;')
out.append('export const STAGE_HEIGHT = 1080;')
out.append('')

out.append('export const MAP_BOUNDS = {')
out.append(f'  minX: {min(p[0] for p in poly_proj)},')
out.append(f'  maxX: {max(p[0] for p in poly_proj)},')
out.append(f'  minY: {min(p[1] for p in poly_proj)},')
out.append(f'  maxY: {max(p[1] for p in poly_proj)},')
out.append(f'  width: {round(max(p[0] for p in poly_proj) - min(p[0] for p in poly_proj), 1)},')
out.append(f'  height: {round(max(p[1] for p in poly_proj) - min(p[1] for p in poly_proj), 1)}')
out.append('};')
out.append('')

out.append(f'export const MAP_OUTLINE = {json.dumps(map_outline_path)};')
out.append('')
out.append(f'export const BOTTOM_OUTLINE = {json.dumps(bottom_outline_path)};')
out.append('')
out.append(f'export const CLIFF_FACETS = {json.dumps(cliff_facets, indent=2)};')
out.append('')
out.append(f'export const BASE_SHADOW = {json.dumps(shadow_d)};')
out.append('')
out.append(f'export const CONTOURS = {json.dumps(contours, indent=2)};')
out.append('')
out.append(f'export const RIVERS = {json.dumps(rivers, indent=2)};')
out.append('')
out.append(f'export const LANDMARKS = {json.dumps(landmarks, ensure_ascii=False, indent=2)};')
out.append('')
out.append(f'export const TREES = {json.dumps(trees, indent=2)};')
out.append('')
out.append(f'export const CHECKPOINTS = {json.dumps(checkpoints, ensure_ascii=False, indent=2)};')
out.append('')
out.append(f'export const ROUTE_SEGMENTS = {json.dumps(route_segments, indent=2)};')
out.append('')

out.append('''export const CAMERA_PRESETS = {
  OVERVIEW: {
    cx: 1100,
    cy: 790,
    zoom: 0.72,
    screenTargetX: 960,
    screenTargetY: 550
  },
  FOCUS: (index) => {
    const cp = CHECKPOINTS[index] || CHECKPOINTS[0];
    return {
      cx: cp.x,
      cy: cp.y,
      zoom: 1.95,
      screenTargetX: 520, // Checkpoint positioned at left-center on 1920x1080 stage
      screenTargetY: 550
    };
  }
};

/**
 * Computes CSS transform string for camera wrapper.
 * Target point (cx, cy) in world coords maps to (screenTargetX, screenTargetY) on stage.
 */
export function getCameraTransform(camera) {
  const { cx, cy, zoom, screenTargetX = 960, screenTargetY = 550 } = camera;
  const tx = screenTargetX - cx * zoom;
  const ty = screenTargetY - cy * zoom;
  return "translate3d(" + tx.toFixed(2) + "px, " + ty.toFixed(2) + "px, 0px) scale(" + zoom.toFixed(4) + ")";
}
''')

with open('src/game/worldData.js', 'w', encoding='utf-8') as f:
    f.write('\n'.join(out))

print('Successfully generated src/game/worldData.js with North-Up real boundary!')
