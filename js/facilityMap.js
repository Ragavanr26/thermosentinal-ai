/**
 * ThermoSentinel AI - Facility Map & Canvas Renderer
 */

import { ASSET_STATUSES } from './assetsData.js';

export class FacilityMap {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.assets = options.assets || [];
    this.onSelectAsset = options.onSelectAsset || (() => {});
    
    this.dronePos = { x: 100, y: 80, angle: 0 };
    this.selectedAssetId = null;
    this.hoveredAssetId = null;
    
    this.initCanvas();
    this.attachEvents();
    this.render();
  }

  initCanvas() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.width = rect.width || 800;
    this.height = Math.max(rect.height, 460) || 460;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  attachEvents() {
    window.addEventListener('resize', () => {
      this.initCanvas();
      this.render();
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
      const mouseY = (e.clientY - rect.top) * (this.canvas.height / rect.height);
      
      const sx = this.width / 800;
      const sy = this.height / 460;

      let foundHover = null;
      this.assets.forEach(asset => {
        const dx = mouseX - (asset.mapCoords.x * sx);
        const dy = mouseY - (asset.mapCoords.y * sy);
        if (Math.sqrt(dx * dx + dy * dy) < 22) {
          foundHover = asset.id;
        }
      });

      if (this.hoveredAssetId !== foundHover) {
        this.hoveredAssetId = foundHover;
        this.canvas.style.cursor = foundHover ? 'pointer' : 'default';
        this.render();
      }
    });

    this.canvas.addEventListener('click', () => {
      if (this.hoveredAssetId) {
        this.selectedAssetId = this.hoveredAssetId;
        this.onSelectAsset(this.selectedAssetId);
        this.render();
      }
    });
  }

  updateAssets(assets) {
    this.assets = assets;
    this.render();
  }

  setDronePosition(pos) {
    this.dronePos = pos;
    this.render();
  }

  setSelectedAsset(assetId) {
    this.selectedAssetId = assetId;
    this.render();
  }

  render() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    const sx = w / 800;
    const sy = h / 460;

    ctx.fillStyle = '#0a0e17';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
    ctx.lineWidth = 1;
    const gridSize = 40 * sx;
    for (let x = 0; x < w; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    this.drawZone(ctx, 50 * sx, 50 * sy, 350 * sx, 200 * sy, 'ZONE A: SUBSTATION & TRANSFORMERS', 'rgba(0, 242, 254, 0.03)', 'rgba(0, 242, 254, 0.2)');
    this.drawZone(ctx, 420 * sx, 50 * sy, 330 * sx, 150 * sy, 'ZONE B: 13.8kV SWITCHGEAR BAY', 'rgba(255, 171, 0, 0.03)', 'rgba(255, 171, 0, 0.2)');
    this.drawZone(ctx, 610 * sx, 220 * sy, 150 * sx, 210 * sy, 'ZONE C: PUMP HOUSE & MCC', 'rgba(0, 230, 118, 0.03)', 'rgba(0, 230, 118, 0.2)');
    this.drawZone(ctx, 50 * sx, 270 * sy, 530 * sx, 160 * sy, 'ZONE D: SWITCHYARD & BUSBARS', 'rgba(156, 39, 176, 0.03)', 'rgba(156, 39, 176, 0.2)');

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.setLineDash([8 * sx, 6 * sx]);
    ctx.lineWidth = 2 * sx;
    ctx.beginPath();
    ctx.moveTo(220 * sx, 160 * sy); ctx.lineTo(300 * sx, 400 * sy);
    ctx.lineTo(480 * sx, 140 * sy); ctx.lineTo(540 * sx, 440 * sy);
    ctx.stroke();
    ctx.setLineDash([]);

    const sortedWaypoints = [...this.assets].sort((a, b) => a.waypointIndex - b.waypointIndex);
    if (sortedWaypoints.length > 1) {
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.lineWidth = 2.5 * sx;
      ctx.setLineDash([4 * sx, 4 * sx]);
      ctx.beginPath();
      ctx.moveTo(100 * sx, 80 * sy);
      sortedWaypoints.forEach(asset => {
        ctx.lineTo(asset.mapCoords.x * sx, asset.mapCoords.y * sy);
      });
      ctx.lineTo(100 * sx, 80 * sy);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = 'rgba(0, 242, 254, 0.1)';
    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(100 * sx, 80 * sy, 18 * sx, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#00f2fe';
    ctx.font = `900 ${11 * sx}px 'JetBrains Mono', monospace`;
    ctx.textAlign = 'center';
    ctx.fillText('H', 100 * sx, 84 * sy);

    this.assets.forEach(asset => {
      const ax = asset.mapCoords.x * sx;
      const ay = asset.mapCoords.y * sy;
      const statusObj = ASSET_STATUSES[asset.status.toUpperCase()] || ASSET_STATUSES.NORMAL;
      const isSelected = asset.id === this.selectedAssetId;
      const isHovered = asset.id === this.hoveredAssetId;

      if (asset.status === 'critical' || asset.status === 'high_risk') {
        const pulse = (Math.sin(Date.now() / 250) + 1) / 2;
        ctx.fillStyle = statusObj.color;
        ctx.globalAlpha = 0.15 + pulse * 0.25;
        ctx.beginPath();
        ctx.arc(ax, ay, (22 + pulse * 10) * sx, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      if (isSelected || isHovered) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2 * sx;
        ctx.beginPath();
        ctx.arc(ax, ay, 20 * sx, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = statusObj.color;
      ctx.shadowColor = statusObj.color;
      ctx.shadowBlur = isSelected ? 16 : 8;
      ctx.beginPath();
      ctx.arc(ax, ay, 12 * sx, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#000000';
      ctx.font = `bold ${10 * sx}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`WP${asset.waypointIndex}`, ax, ay + 3.5 * sy);

      ctx.fillStyle = isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.85)';
      ctx.font = `bold ${11 * sx}px 'JetBrains Mono', monospace`;
      ctx.fillText(`${asset.id}`, ax, ay - 16 * sy);

      ctx.fillStyle = statusObj.color;
      ctx.font = `bold ${10 * sx}px monospace`;
      ctx.fillText(`${asset.currentScanTemp}°C`, ax, ay + 24 * sy);
    });

    const dx = this.dronePos.x * sx;
    const dy = this.dronePos.y * sy;

    ctx.save();
    ctx.translate(dx, dy);
    ctx.rotate((this.dronePos.angle || 0) * Math.PI / 180);

    const fovGrad = ctx.createRadialGradient(0, 0, 5 * sx, 0, 0, 60 * sx);
    fovGrad.addColorStop(0, 'rgba(0, 242, 254, 0.35)');
    fovGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
    ctx.fillStyle = fovGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 60 * sx, -Math.PI / 4, Math.PI / 4);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 2 * sx;

    ctx.beginPath();
    ctx.moveTo(-12 * sx, -12 * sy); ctx.lineTo(12 * sx, 12 * sy);
    ctx.moveTo(-12 * sx, 12 * sy); ctx.lineTo(12 * sx, -12 * sy);
    ctx.stroke();

    [[-12, -12], [12, -12], [-12, 12], [12, 12]].forEach(([rx, ry]) => {
      ctx.fillStyle = 'rgba(0, 242, 254, 0.3)';
      ctx.beginPath();
      ctx.arc(rx * sx, ry * sy, 6 * sx, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    });

    ctx.fillStyle = '#00f2fe';
    ctx.beginPath();
    ctx.arc(0, 0, 5 * sx, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff5252';
    ctx.beginPath();
    ctx.arc(6 * sx, 0, 3 * sx, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawZone(ctx, x, y, width, height, title, fill, stroke) {
    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);

    ctx.fillStyle = stroke;
    ctx.font = "bold 9px 'JetBrains Mono', monospace";
    ctx.textAlign = 'left';
    ctx.fillText(title, x + 8, y + 16);
  }
}

window.FacilityMap = FacilityMap;
