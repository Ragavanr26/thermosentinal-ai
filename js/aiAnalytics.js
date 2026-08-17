/**
 * ThermoSentinel AI - Predictive Thermal Analytics & Diagnostic Engine
 */

export class AIAnalytics {
  constructor(chartCanvasId, options = {}) {
    this.canvas = document.getElementById(chartCanvasId);
    if (this.canvas) {
      this.ctx = this.canvas.getContext('2d');
    }
  }

  static calculateRiskScore(asset) {
    const deltaT = asset.currentScanTemp - asset.referenceTemp;
    const ambientDelta = asset.currentScanTemp - asset.ambientTemp;

    const loadRatio = asset.actualCurrent > 0 ? (asset.ratedCurrent / asset.actualCurrent) : 1.0;
    const correctedTemp = asset.ambientTemp + (asset.currentScanTemp - asset.ambientTemp) * Math.pow(loadRatio, 1.8);

    let score = 0;
    if (deltaT <= 5) score = Math.min(25, deltaT * 5);
    else if (deltaT <= 15) score = 25 + ((deltaT - 5) / 10) * 30;
    else if (deltaT <= 30) score = 55 + ((deltaT - 15) / 15) * 25;
    else score = Math.min(100, 80 + ((deltaT - 30) / 20) * 20);

    return {
      deltaT: parseFloat(deltaT.toFixed(1)),
      correctedTemp: parseFloat(correctedTemp.toFixed(1)),
      riskScore: Math.round(score),
      loadRatio: parseFloat(loadRatio.toFixed(2))
    };
  }

  renderHistoricalChart(asset, canvasId = 'history-chart-canvas') {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width || 600;
    canvas.height = rect.height || 280;

    const w = canvas.width;
    const h = canvas.height;
    const padding = { top: 30, right: 30, bottom: 40, left: 50 };

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    const history = asset.history || [];
    if (history.length === 0) return;

    const points = history.map(h => ({ date: h.date, temp: h.temp, isPredicted: false }));
    const lastPoint = points[points.length - 1];

    if (asset.status === 'critical' || asset.status === 'high_risk' || asset.status === 'warning') {
      const slope = (asset.currentScanTemp - history[0].temp) / history.length;
      points.push({ date: 'Forecast +15d', temp: Math.min(130, lastPoint.temp + slope * 1.5), isPredicted: true });
      points.push({ date: 'Forecast +30d', temp: Math.min(150, lastPoint.temp + slope * 3.2), isPredicted: true });
    }

    const minTemp = 20;
    const maxTemp = 140;

    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b';
    ctx.textAlign = 'right';

    [30, 60, 90, 120].forEach(tempVal => {
      const y = padding.top + chartH - ((tempVal - minTemp) / (maxTemp - minTemp)) * chartH;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(w - padding.right, y);
      ctx.stroke();

      ctx.fillText(`${tempVal}°C`, padding.left - 8, y + 3);
    });

    const critY = padding.top + chartH - ((80 - minTemp) / (maxTemp - minTemp)) * chartH;
    ctx.strokeStyle = 'rgba(255, 82, 82, 0.6)';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(padding.left, critY);
    ctx.lineTo(w - padding.right, critY);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#ff5252';
    ctx.textAlign = 'right';
    ctx.fillText('CRITICAL LIMIT (80°C)', w - padding.right, critY - 6);

    const getCoords = (index, temp) => {
      const x = padding.left + (index / (points.length - 1)) * chartW;
      const y = padding.top + chartH - ((temp - minTemp) / (maxTemp - minTemp)) * chartH;
      return { x, y };
    };

    ctx.strokeStyle = '#00f2fe';
    ctx.lineWidth = 3;
    ctx.beginPath();

    let splitIndex = 0;
    points.forEach((pt, i) => {
      const { x, y } = getCoords(i, pt.temp);
      if (i === 0) ctx.moveTo(x, y);
      else if (!pt.isPredicted) ctx.lineTo(x, y);
      else {
        if (splitIndex === 0) splitIndex = i - 1;
      }
    });
    ctx.stroke();

    if (splitIndex > 0) {
      ctx.strokeStyle = '#ffab00';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      const startPt = getCoords(splitIndex, points[splitIndex].temp);
      ctx.moveTo(startPt.x, startPt.y);

      for (let i = splitIndex + 1; i < points.length; i++) {
        const pt = getCoords(i, points[i].temp);
        ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    points.forEach((pt, i) => {
      const { x, y } = getCoords(i, pt.temp);
      ctx.fillStyle = pt.isPredicted ? '#ffab00' : (pt.temp >= 80 ? '#ff5252' : '#00f2fe');
      ctx.beginPath();
      ctx.arc(x, y, pt.isPredicted ? 5 : 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pt.date.split(' ')[0], x, h - 12);
    });
  }
}

window.AIAnalytics = AIAnalytics;
