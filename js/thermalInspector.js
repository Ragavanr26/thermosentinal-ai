/**
 * ThermoSentinel AI - FLIR Thermal & RGB Vision Inspector Module
 */

export class ThermalInspector {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentAsset = null;
    this.palette = 'ironbow';
    this.splitRatio = 0.5;
    this.alignOffset = { x: 0, y: 0, scale: 1.0 };
    this.isDraggingSplitter = false;

    this.initDOM();
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="glass-panel p-4 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full bg-cyan-400 animate-ping"></span>
            <h3 id="inspector-asset-title" class="font-mono text-sm font-bold text-cyan-400">SELECT AN ASSET TO SCAN</h3>
            <span id="inspector-asset-badge" class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">STANDBY</span>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-xs">
              <label class="text-slate-400">PALETTE:</label>
              <select id="palette-selector" class="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded px-2 py-1">
                <option value="ironbow">FLIR Ironbow</option>
                <option value="rainbow">Thermal Rainbow</option>
                <option value="whitehot">White-Hot</option>
                <option value="blackhot">Black-Hot</option>
              </select>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-center gap-3">
          <div id="inspector-viewport" class="relative w-[640px] h-[380px] rounded-lg overflow-hidden border-2 border-slate-700 shadow-2xl">
            <canvas id="rgb-canvas" width="640" height="380" class="absolute top-0 left-0"></canvas>
            <canvas id="thermal-canvas" width="640" height="380" class="absolute top-0 left-0"></canvas>
            
            <div id="split-handle" class="split-handle">
              <div class="split-knob">↔</div>
            </div>

            <div id="hotspot-box" class="hotspot-box">
              <div class="hotspot-ping"></div>
              <div class="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-600 text-white px-2 py-0.5 rounded text-[9px] font-bold flex gap-1 shadow-lg">
                <span>AI HOTSPOT</span>
                <span id="hotspot-temp-val">-- °C</span>
              </div>
            </div>

            <div id="spot-probe" class="spot-probe">
              <div id="probe-temp-val" class="probe-val">-- °C</div>
            </div>
          </div>

          <div class="flex items-center gap-3 w-[640px] text-xs font-bold">
            <span id="scale-min-val" class="text-slate-400">20.0 °C</span>
            <div id="scale-gradient" class="flex-1 h-3 rounded scale-gradient ironbow"></div>
            <span id="scale-max-val" class="text-slate-400">100.0 °C</span>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 bg-slate-950/60 p-3 rounded-lg text-xs">
          <div class="space-y-1">
            <label class="text-slate-400 block">RGB / Thermal Split: <span id="split-val-text" class="text-cyan-400 font-bold">50%</span></label>
            <input type="range" id="split-range" min="0" max="100" value="50" class="w-full accent-cyan-400">
          </div>

          <div class="space-y-1">
            <label class="text-slate-400 block">Alignment Offset X: <span id="offset-x-val" class="text-cyan-400 font-bold">0px</span></label>
            <input type="range" id="offset-x-range" min="-30" max="30" value="0" class="w-full accent-cyan-400">
          </div>

          <div class="space-y-1">
            <label class="text-slate-400 block">Alignment Offset Y: <span id="offset-y-val" class="text-cyan-400 font-bold">0px</span></label>
            <input type="range" id="offset-y-range" min="-30" max="30" value="0" class="w-full accent-cyan-400">
          </div>
        </div>
      </div>
    `;

    this.rgbCanvas = document.getElementById('rgb-canvas');
    this.thermalCanvas = document.getElementById('thermal-canvas');
    this.rgbCtx = this.rgbCanvas.getContext('2d');
    this.thermalCtx = this.thermalCanvas.getContext('2d');
    this.viewport = document.getElementById('inspector-viewport');
    this.splitHandle = document.getElementById('split-handle');
    this.hotspotBox = document.getElementById('hotspot-box');
    this.spotProbe = document.getElementById('spot-probe');

    this.attachEvents();
  }

  attachEvents() {
    const paletteSel = document.getElementById('palette-selector');
    if (paletteSel) {
      paletteSel.addEventListener('change', (e) => {
        this.palette = e.target.value;
        const gradientEl = document.getElementById('scale-gradient');
        if (gradientEl) gradientEl.className = `scale-gradient ${this.palette}`;
        this.render();
      });
    }

    const splitRange = document.getElementById('split-range');
    if (splitRange) {
      splitRange.addEventListener('input', (e) => {
        this.splitRatio = e.target.value / 100;
        document.getElementById('split-val-text').innerText = `${e.target.value}%`;
        this.updateSplitter();
      });
    }

    const offsetXRange = document.getElementById('offset-x-range');
    if (offsetXRange) {
      offsetXRange.addEventListener('input', (e) => {
        this.alignOffset.x = parseInt(e.target.value);
        document.getElementById('offset-x-val').innerText = `${e.target.value}px`;
        this.render();
      });
    }

    const offsetYRange = document.getElementById('offset-y-range');
    if (offsetYRange) {
      offsetYRange.addEventListener('input', (e) => {
        this.alignOffset.y = parseInt(e.target.value);
        document.getElementById('offset-y-val').innerText = `${e.target.value}px`;
        this.render();
      });
    }

    if (this.splitHandle) {
      this.splitHandle.addEventListener('mousedown', () => { this.isDraggingSplitter = true; });
      window.addEventListener('mouseup', () => { this.isDraggingSplitter = false; });
      window.addEventListener('mousemove', (e) => {
        if (!this.isDraggingSplitter || !this.viewport) return;
        const rect = this.viewport.getBoundingClientRect();
        let ratio = (e.clientX - rect.left) / rect.width;
        ratio = Math.max(0.02, Math.min(0.98, ratio));
        this.splitRatio = ratio;
        if (splitRange) splitRange.value = Math.round(ratio * 100);
        document.getElementById('split-val-text').innerText = `${Math.round(ratio * 100)}%`;
        this.updateSplitter();
      });
    }

    if (this.viewport) {
      this.viewport.addEventListener('mousemove', (e) => {
        if (!this.currentAsset) return;
        const rect = this.viewport.getBoundingClientRect();
        const rx = (e.clientX - rect.left) / rect.width;
        const ry = (e.clientY - rect.top) / rect.height;

        this.spotProbe.style.display = 'block';
        this.spotProbe.style.left = `${(rx * 100).toFixed(1)}%`;
        this.spotProbe.style.top = `${(ry * 100).toFixed(1)}%`;

        const hsX = this.currentAsset.hotspotPos.x / 100;
        const hsY = this.currentAsset.hotspotPos.y / 100;
        const dist = Math.sqrt(Math.pow(rx - hsX, 2) + Math.pow(ry - hsY, 2));

        let temp = this.currentAsset.ambientTemp + 5;
        if (dist < 0.35) {
          const factor = Math.pow(1 - (dist / 0.35), 2);
          temp += (this.currentAsset.currentScanTemp - (this.currentAsset.ambientTemp + 5)) * factor;
        }
        document.getElementById('probe-temp-val').innerText = `${temp.toFixed(1)} °C`;
      });

      this.viewport.addEventListener('mouseleave', () => {
        this.spotProbe.style.display = 'none';
      });
    }
  }

  loadAsset(asset) {
    this.currentAsset = asset;

    document.getElementById('inspector-asset-title').innerText = `${asset.id} - ${asset.name.toUpperCase()}`;
    const badge = document.getElementById('inspector-asset-badge');
    badge.innerText = asset.status.toUpperCase();

    document.getElementById('scale-min-val').innerText = `${asset.ambientTemp.toFixed(1)} °C`;
    document.getElementById('scale-max-val').innerText = `${(asset.currentScanTemp + 10).toFixed(1)} °C`;

    if (asset.status !== 'normal') {
      this.hotspotBox.style.display = 'flex';
      this.hotspotBox.style.left = `${asset.hotspotPos.x}%`;
      this.hotspotBox.style.top = `${asset.hotspotPos.y}%`;
      document.getElementById('hotspot-temp-val').innerText = `${asset.currentScanTemp} °C`;
    } else {
      this.hotspotBox.style.display = 'none';
    }

    this.updateSplitter();
    this.render();
  }

  updateSplitter() {
    if (!this.splitHandle || !this.thermalCanvas) return;
    this.splitHandle.style.left = `${(this.splitRatio * 100).toFixed(1)}%`;
    this.thermalCanvas.style.clipPath = `inset(0 0 0 ${(this.splitRatio * 100).toFixed(1)}%)`;
  }

  render() {
    if (!this.currentAsset) return;
    this.renderRGBStream();
    this.renderThermalStream();
  }

  renderRGBStream() {
    const ctx = this.rgbCtx;
    const w = 640;
    const h = 380;

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 30, 520, 320);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(62, 32, 516, 316);

    ctx.fillStyle = '#475569';
    ctx.fillRect(160, 70, 50, 180);
    ctx.fillRect(295, 70, 50, 180);
    ctx.fillRect(430, 70, 50, 180);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('PHASE A', 185, 60);
    ctx.fillText('PHASE B', 320, 60);
    ctx.fillText('PHASE C', 455, 60);

    [185, 320, 455].forEach(cx => {
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(cx, 150, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.beginPath();
      ctx.arc(cx, 150, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  renderThermalStream() {
    const ctx = this.thermalCtx;
    const w = 640;
    const h = 380;

    ctx.save();
    ctx.translate(this.alignOffset.x, this.alignOffset.y);

    ctx.fillStyle = '#050811';
    ctx.fillRect(-50, -50, w + 100, h + 100);

    const asset = this.currentAsset;
    const hsX = (asset.hotspotPos.x / 100) * w;
    const hsY = (asset.hotspotPos.y / 100) * h;

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const minT = asset.ambientTemp;
    const maxT = asset.currentScanTemp + 10;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        let temp = minT + 8.0;

        if (x > 140 && x < 500 && y > 60 && y < 260) {
          temp += 12.0;
        }

        const dx = x - hsX;
        const dy = y - hsY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 140 && asset.status !== 'normal') {
          const factor = Math.pow(Math.max(0, 1 - (dist / 140)), 2.2);
          temp += (asset.currentScanTemp - temp) * factor;
        }

        const color = this.mapTempToColor(temp, minT, maxT, this.palette);

        const index = (y * w + x) * 4;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
    ctx.restore();
  }

  mapTempToColor(temp, minT, maxT, palette) {
    const t = Math.max(0, Math.min(1, (temp - minT) / (maxT - minT)));

    if (palette === 'whitehot') {
      const v = Math.round(t * 255);
      return { r: v, g: v, b: v };
    }
    if (palette === 'blackhot') {
      const v = Math.round((1 - t) * 255);
      return { r: v, g: v, b: v };
    }
    if (palette === 'rainbow') {
      let r = 0, g = 0, b = 0;
      if (t < 0.2) { b = Math.round(t / 0.2 * 255); }
      else if (t < 0.4) { b = 255; g = Math.round((t - 0.2) / 0.2 * 255); }
      else if (t < 0.6) { g = 255; b = Math.round((0.6 - t) / 0.2 * 255); }
      else if (t < 0.8) { g = 255; r = Math.round((t - 0.6) / 0.2 * 255); }
      else if (t < 0.95) { r = 255; g = Math.round((0.95 - t) / 0.15 * 255); }
      else { r = 255; g = 255; b = Math.round((t - 0.95) / 0.05 * 255); }
      return { r, g, b };
    }

    let r = 0, g = 0, b = 0;
    if (t < 0.25) {
      r = Math.round(t / 0.25 * 80);
      b = Math.round(t / 0.25 * 160);
    } else if (t < 0.5) {
      const p = (t - 0.25) / 0.25;
      r = Math.round(80 + p * 120);
      g = Math.round(p * 40);
      b = Math.round(160 - p * 120);
    } else if (t < 0.75) {
      const p = (t - 0.5) / 0.25;
      r = Math.round(200 + p * 55);
      g = Math.round(40 + p * 160);
      b = 20;
    } else {
      const p = (t - 0.75) / 0.25;
      r = 255;
      g = Math.round(200 + p * 55);
      b = Math.round(20 + p * 235);
    }
    return { r, g, b };
  }
}

window.ThermalInspector = ThermalInspector;
