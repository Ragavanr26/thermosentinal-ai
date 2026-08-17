/**
 * ThermoSentinel AI - React AI Predictive Trends Component
 */

window.AITrendsView = function AITrendsView({ asset }) {
  const chartCanvasRef = React.useRef(null);
  const analyticsRef = React.useRef(null);

  React.useEffect(() => {
    if (!analyticsRef.current && window.AIAnalytics) {
      analyticsRef.current = new window.AIAnalytics('history-chart-canvas');
    }

    if (analyticsRef.current && asset) {
      analyticsRef.current.renderHistoricalChart(asset, 'history-chart-canvas');
    }
  }, [asset]);

  if (!asset) return null;

  const riskData = window.AIAnalytics ? window.AIAnalytics.calculateRiskScore(asset) : { riskScore: 85, deltaT: 30, correctedTemp: 70 };

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Historical Degradation Chart */}
      <div class="lg:col-span-2 glass-panel p-4 flex flex-col h-[480px]">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-xs font-bold tracking-wider text-slate-200 uppercase">Historical Thermal Degradation & 30-Day Failure Forecast</h3>
          <span class="font-mono font-bold text-cyan-400 text-xs">{asset.id} - {asset.name}</span>
        </div>

        <div class="flex-1 relative rounded-lg overflow-hidden border border-slate-700/50 bg-slate-950 p-2">
          <canvas id="history-chart-canvas" ref={chartCanvasRef} class="w-full h-full block"></canvas>
        </div>
      </div>

      {/* AI Risk Score & Root Cause Analysis */}
      <div class="glass-panel p-4 flex flex-col justify-between space-y-4">
        <div>
          <h3 class="text-xs font-bold tracking-wider text-slate-200 uppercase mb-4">AI Risk Matrix & Failure Diagnostics</h3>

          <div class="bg-red-500/10 border border-red-500/40 p-4 rounded-xl text-center mb-4">
            <span class="text-[10px] font-bold text-slate-400 uppercase block">Anomaly Risk Index</span>
            <span class="font-mono text-3xl font-extrabold text-red-400">{riskData.riskScore} / 100</span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between py-1 border-b border-slate-800">
              <span class="text-slate-400">Scan Temperature:</span>
              <span class="font-bold text-white">{asset.currentScanTemp} °C</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-800">
              <span class="text-slate-400">Baseline Reference:</span>
              <span class="font-bold text-slate-300">{asset.referenceTemp} °C</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-800">
              <span class="text-slate-400">Delta T (ΔT Anomaly):</span>
              <span class="font-bold text-red-400">+{riskData.deltaT} °C</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-800">
              <span class="text-slate-400">Load-Corrected Temp:</span>
              <span class="font-bold text-amber-400">{riskData.correctedTemp} °C</span>
            </div>
          </div>
        </div>

        <div class="glass-panel-cyan p-3 space-y-1">
          <h4 class="text-[10px] font-bold text-cyan-400 uppercase">AI Root Cause Analyzer</h4>
          <p class="text-xs text-slate-300 leading-relaxed">{asset.diagnosis}</p>
        </div>
      </div>
    </div>
  );
};
