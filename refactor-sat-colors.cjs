const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/components/cesium/CesiumViewer.vue');
let code = fs.readFileSync(file, 'utf-8');

// 1. Earth shadow
code = code.replace('v.scene.globe.enableLighting = true', 'v.scene.globe.enableLighting = false');

// 2. Satellite color string
code = code.replace(
  `  if (status === 'offline') return Cesium.Color.fromCssColorString('#7b8794')\n  return Cesium.Color.fromCssColorString('#86e36f')`,
  `  if (status === 'offline') return Cesium.Color.fromCssColorString('#7b8794')\n  return Cesium.Color.fromCssColorString('#1e90ff')`
);

// 3. Orbit opacity
code = code.replace(
  `material: color.withAlpha(isAbnormal ? 0.72 : 0.3)`,
  `material: color.withAlpha(isAbnormal ? 0.72 : 0.45)`
);

code = code.replace(
  `material: color.withAlpha(isAbnormal ? 0.42 : 0.18)`,
  `material: color.withAlpha(isAbnormal ? 0.42 : 0.28)`
);

// 4. CSS dots
code = code.replace(
  `.dot.leo { background: #86e36f; }`,
  `.dot.leo { background: #1e90ff; box-shadow: 0 0 6px rgba(30,144,255,0.6); }`
);

// 5. CSS Chips
code = code.replace(
  `.status-chip.normal { box-shadow: inset 0 0 0 1px rgba(134, 227, 111, 0.12); }`,
  `.status-chip.normal { box-shadow: inset 0 0 0 1px rgba(30, 144, 255, 0.16); }`
);

code = code.replace(
  `.status-badge.normal,
.detail-status.normal {
  color: #8fe388;
  background: rgba(143, 227, 136, 0.12);
}`,
  `.status-badge.normal,
.detail-status.normal {
  color: #4da3ff;
  background: rgba(30, 144, 255, 0.15);
}`
);

// 6. Base map styling
code = code.replace(
  `        imageryLayer.brightness = 1.12
        imageryLayer.gamma = 0.92
        imageryLayer.saturation = 0.58`,
  `        imageryLayer.brightness = 0.5
        imageryLayer.gamma = 0.7
        imageryLayer.saturation = 0.2`
);

fs.writeFileSync(file, code, 'utf-8');
console.log('Colors and lighting updated.');
