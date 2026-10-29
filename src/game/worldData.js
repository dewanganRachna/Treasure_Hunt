/**
 * Chhattisgarh Digital Explorer - World & Map Data
 * Stationary 3D terrain world with fixed geometry
 */

export const WORLD_WIDTH = 2600;
export const WORLD_HEIGHT = 1500;
export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;
export const MAP_OUTLINE = "M 340 1020 C 333.3 1038.3, 310.0 1050.0, 310 1070 C 310.0 1090.0, 325.0 1120.0, 340 1140 C 355.0 1160.0, 371.7 1175.0, 400 1190 C 428.3 1205.0, 470.0 1220.0, 510 1230 C 550.0 1240.0, 595.0 1245.0, 640 1250 C 685.0 1255.0, 733.3 1261.7, 780 1260 C 826.7 1258.3, 873.3 1246.7, 920 1240 C 966.7 1233.3, 1013.3 1223.3, 1060 1220 C 1106.7 1216.7, 1153.3 1218.3, 1200 1220 C 1246.7 1221.7, 1293.3 1233.3, 1340 1230 C 1386.7 1226.7, 1433.3 1210.0, 1480 1200 C 1526.7 1190.0, 1573.3 1181.7, 1620 1170 C 1666.7 1158.3, 1713.3 1143.3, 1760 1130 C 1806.7 1116.7, 1853.3 1105.0, 1900 1090 C 1946.7 1075.0, 1996.7 1058.3, 2040 1040 C 2083.3 1021.7, 2125.0 1000.0, 2160 980 C 2195.0 960.0, 2226.7 941.7, 2250 920 C 2273.3 898.3, 2290.0 875.0, 2300 850 C 2310.0 825.0, 2316.7 796.7, 2310 770 C 2303.3 743.3, 2281.7 713.3, 2260 690 C 2238.3 666.7, 2213.3 646.7, 2180 630 C 2146.7 613.3, 2103.3 603.3, 2060 590 C 2016.7 576.7, 1966.7 566.7, 1920 550 C 1873.3 533.3, 1823.3 510.0, 1780 490 C 1736.7 470.0, 1698.3 443.3, 1660 430 C 1621.7 416.7, 1583.3 405.0, 1550 410 C 1516.7 415.0, 1490.0 441.7, 1460 460 C 1430.0 478.3, 1405.0 503.3, 1370 520 C 1335.0 536.7, 1291.7 546.7, 1250 560 C 1208.3 573.3, 1163.3 586.7, 1120 600 C 1076.7 613.3, 1033.3 625.0, 990 640 C 946.7 655.0, 903.3 673.3, 860 690 C 816.7 706.7, 773.3 723.3, 730 740 C 686.7 756.7, 640.0 773.3, 600 790 C 560.0 806.7, 521.7 821.7, 490 840 C 458.3 858.3, 433.3 880.0, 410 900 C 386.7 920.0, 361.7 940.0, 350 960 C 338.3 980.0, 346.7 1001.7, 340 1020 Z";

export const CLIFF_FACETS = [
  {
    "d": "M 310 1070 L 340 1140 L 340 1195 L 310 1125 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 340 1140 L 400 1190 L 400 1245 L 340 1195 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 400 1190 L 510 1230 L 510 1285 L 400 1245 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 510 1230 L 640 1250 L 640 1305 L 510 1285 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 640 1250 L 780 1260 L 780 1315 L 640 1305 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 780 1260 L 920 1240 L 920 1295 L 780 1315 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 920 1240 L 1060 1220 L 1060 1275 L 920 1295 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 1060 1220 L 1200 1220 L 1200 1275 L 1060 1275 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 1200 1220 L 1340 1230 L 1340 1285 L 1200 1275 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 1340 1230 L 1480 1200 L 1480 1255 L 1340 1285 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 1480 1200 L 1620 1170 L 1620 1225 L 1480 1255 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 1620 1170 L 1760 1130 L 1760 1185 L 1620 1225 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 1760 1130 L 1900 1090 L 1900 1145 L 1760 1185 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 1900 1090 L 2040 1040 L 2040 1095 L 1900 1145 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 2040 1040 L 2160 980 L 2160 1035 L 2040 1095 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 2160 980 L 2250 920 L 2250 975 L 2160 1035 Z",
    "color": "#8A5C30",
    "border": "#9E6D3C",
    "shade": "#7A4F26"
  },
  {
    "d": "M 2250 920 L 2300 850 L 2300 905 L 2250 975 Z",
    "color": "#734823",
    "border": "#85562B",
    "shade": "#633B1A"
  },
  {
    "d": "M 2300 850 L 2310 770 L 2310 825 L 2300 905 Z",
    "color": "#543317",
    "border": "#663F1E",
    "shade": "#45260F"
  },
  {
    "d": "M 2310 770 L 2260 690 L 2260 745 L 2310 825 Z",
    "color": "#543317",
    "border": "#663F1E",
    "shade": "#45260F"
  }
];

export const BASE_SHADOW = "M 310 1143 L 340 1213 L 400 1263 L 510 1303 L 640 1323 L 780 1333 L 920 1313 L 1060 1293 L 1200 1293 L 1340 1303 L 1480 1273 L 1620 1243 L 1760 1203 L 1900 1163 L 2040 1113 L 2160 1053 L 2250 993 L 2300 923 L 2310 843 L 2260 763 L 2260 690 L 310 1070 Z";

export const RIVERS = [
  {
    "d": "M 720 960 C 860 910, 1040 860, 1280 840 C 1500 820, 1720 860, 1920 820 C 2080 790, 2180 750, 2270 730",
    "width": 5.0,
    "name": "Mahanadi"
  },
  {
    "d": "M 1280 840 C 1320 740, 1420 660, 1550 560 C 1590 520, 1620 480, 1650 440",
    "width": 3.5,
    "name": "Hasdeo"
  },
  {
    "d": "M 1040 860 C 960 800, 850 760, 720 760 C 640 760, 570 790, 510 830",
    "width": 3.5,
    "name": "Shivnath"
  },
  {
    "d": "M 1720 860 C 1660 940, 1580 1000, 1480 1080",
    "width": 3.0,
    "name": "Pairi"
  },
  {
    "d": "M 420 1100 C 560 1080, 750 1140, 960 1130 C 1080 1120, 1150 1160, 1260 1160",
    "width": 3.8,
    "name": "Indravati"
  },
  {
    "d": "M 1420 660 C 1380 620, 1310 610, 1260 590",
    "width": 2.4,
    "name": "Arpa"
  },
  {
    "d": "M 1920 820 C 1960 760, 2010 700, 2060 630",
    "width": 2.6,
    "name": "Mand"
  },
  {
    "d": "M 2080 790 C 2120 740, 2160 690, 2200 660",
    "width": 2.2,
    "name": "Kelo"
  }
];

export const TREES = [
  {
    "x": 540,
    "y": 920,
    "scale": 1.1,
    "count": 4
  },
  {
    "x": 620,
    "y": 860,
    "scale": 0.9,
    "count": 3
  },
  {
    "x": 700,
    "y": 940,
    "scale": 1.2,
    "count": 5
  },
  {
    "x": 860,
    "y": 890,
    "scale": 1.0,
    "count": 4
  },
  {
    "x": 920,
    "y": 780,
    "scale": 1.1,
    "count": 3
  },
  {
    "x": 1000,
    "y": 710,
    "scale": 0.85,
    "count": 4
  },
  {
    "x": 1140,
    "y": 820,
    "scale": 1.3,
    "count": 5
  },
  {
    "x": 1240,
    "y": 720,
    "scale": 1.0,
    "count": 3
  },
  {
    "x": 1320,
    "y": 620,
    "scale": 0.9,
    "count": 4
  },
  {
    "x": 1460,
    "y": 600,
    "scale": 1.2,
    "count": 5
  },
  {
    "x": 1580,
    "y": 500,
    "scale": 1.0,
    "count": 4
  },
  {
    "x": 1680,
    "y": 470,
    "scale": 0.8,
    "count": 3
  },
  {
    "x": 1760,
    "y": 560,
    "scale": 1.1,
    "count": 4
  },
  {
    "x": 1880,
    "y": 660,
    "scale": 1.2,
    "count": 5
  },
  {
    "x": 1960,
    "y": 770,
    "scale": 1.0,
    "count": 3
  },
  {
    "x": 2080,
    "y": 840,
    "scale": 1.1,
    "count": 4
  },
  {
    "x": 2160,
    "y": 790,
    "scale": 0.85,
    "count": 3
  },
  {
    "x": 1880,
    "y": 980,
    "scale": 1.0,
    "count": 4
  },
  {
    "x": 1740,
    "y": 1060,
    "scale": 1.2,
    "count": 5
  },
  {
    "x": 1500,
    "y": 960,
    "scale": 1.1,
    "count": 4
  },
  {
    "x": 1360,
    "y": 1120,
    "scale": 1.3,
    "count": 6
  },
  {
    "x": 1100,
    "y": 1150,
    "scale": 1.2,
    "count": 5
  },
  {
    "x": 960,
    "y": 1180,
    "scale": 1.0,
    "count": 4
  },
  {
    "x": 820,
    "y": 1190,
    "scale": 1.1,
    "count": 4
  },
  {
    "x": 660,
    "y": 1160,
    "scale": 1.3,
    "count": 5
  },
  {
    "x": 520,
    "y": 1120,
    "scale": 1.0,
    "count": 4
  },
  {
    "x": 390,
    "y": 1060,
    "scale": 0.9,
    "count": 3
  }
];

export const CONTOURS = [
  "M 680 780 C 820 740, 1020 710, 1240 680 C 1460 650, 1680 580, 1860 630",
  "M 600 860 C 800 830, 1060 800, 1340 760 C 1600 730, 1820 750, 2040 810",
  "M 540 1000 C 720 980, 960 990, 1260 980 C 1520 970, 1780 940, 2020 900",
  "M 460 1140 C 660 1120, 900 1110, 1180 1100 C 1440 1090, 1700 1040, 1920 990",
  "M 1420 540 C 1500 500, 1600 480, 1720 510",
  "M 1340 620 C 1460 580, 1620 560, 1780 600"
];

export const CHECKPOINTS = [
  {
    "id": 1,
    "x": 480,
    "y": 980,
    "nameEn": "Bastar Gateway",
    "nameHi": "बस्तर द्वार",
    "region": "South Zone"
  },
  {
    "id": 2,
    "x": 780,
    "y": 840,
    "nameEn": "Durg Valley",
    "nameHi": "दुर्ग घाटी",
    "region": "West Hub"
  },
  {
    "id": 3,
    "x": 1080,
    "y": 760,
    "nameEn": "Raipur Central",
    "nameHi": "रायपुर केंद्रीय",
    "region": "Central Hub"
  },
  {
    "id": 4,
    "x": 1380,
    "y": 680,
    "nameEn": "Bilaspur Basin",
    "nameHi": "बिलासपुर बेसिन",
    "region": "North-Central"
  },
  {
    "id": 5,
    "x": 1680,
    "y": 600,
    "nameEn": "Surguja Ridge",
    "nameHi": "सरगुजा पर्वतमाला",
    "region": "Northern Ridge"
  },
  {
    "id": 6,
    "x": 2040,
    "y": 700,
    "nameEn": "Raigarh East",
    "nameHi": "रायगढ़ पूर्वी सीमा",
    "region": "Eastern Plateau"
  },
  {
    "id": 7,
    "x": 1980,
    "y": 920,
    "nameEn": "Mahasamund Plains",
    "nameHi": "महासमुंद मैदान",
    "region": "East Central"
  },
  {
    "id": 8,
    "x": 1620,
    "y": 1020,
    "nameEn": "Dhamtari Reservoir",
    "nameHi": "धमतरी जलक्षेत्र",
    "region": "South Central"
  },
  {
    "id": 9,
    "x": 1220,
    "y": 1080,
    "nameEn": "Kanker Forest",
    "nameHi": "कांकेर वन क्षेत्र",
    "region": "Forest Belt"
  },
  {
    "id": 10,
    "x": 740,
    "y": 1120,
    "nameEn": "Dantewada Heights",
    "nameHi": "दंतेवाड़ा शिखर",
    "region": "Highlands"
  }
];

export const ROUTE_SEGMENTS = [
  "M 480 980 C 560 920, 680 870, 780 840",
  "M 780 840 C 880 810, 980 780, 1080 760",
  "M 1080 760 C 1180 730, 1280 700, 1380 680",
  "M 1380 680 C 1480 650, 1580 620, 1680 600",
  "M 1680 600 C 1800 620, 1940 650, 2040 700",
  "M 2040 700 C 2060 780, 2040 850, 1980 920",
  "M 1980 920 C 1880 970, 1750 1000, 1620 1020",
  "M 1620 1020 C 1490 1050, 1350 1070, 1220 1080",
  "M 1220 1080 C 1060 1100, 900 1120, 740 1120",
  "M 740 1120 C 640 1110, 540 1050, 480 980"
];

export const CAMERA_PRESETS = {
  OVERVIEW: {
    cx: 1310,
    cy: 820,
    zoom: 0.82,
    screenTargetX: 960,
    screenTargetY: 550
  },
  FOCUS: (index) => {
    const cp = CHECKPOINTS[index] || CHECKPOINTS[0];
    return {
      cx: cp.x,
      cy: cp.y,
      zoom: 2.15,
      screenTargetX: 520, // Checkpoint positioned at left-center on 1920x1080
      screenTargetY: 550
    };
  }
};

/**
 * Computes CSS transform string for camera wrapper
 * Target point (cx, cy) in world coords maps to (screenTargetX, screenTargetY) on stage
 */
export function getCameraTransform(camera) {
  const { cx, cy, zoom, screenTargetX = 960, screenTargetY = 550 } = camera;
  const tx = screenTargetX - cx * zoom;
  const ty = screenTargetY - cy * zoom;
  return "translate3d(" + tx.toFixed(2) + "px, " + ty.toFixed(2) + "px, 0px) scale(" + zoom.toFixed(4) + ")";
}
