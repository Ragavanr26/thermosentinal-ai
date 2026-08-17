/**
 * ThermoSentinel AI - React Dashboard Overview Component
 */

window.DashboardView = function DashboardView({ assets, onSelectAsset, onNavigate }) {
  const [filter, setFilter] = React.useState('all');

  const criticalCount = assets.filter(a => a.status === 'critical').length;
  const warningCount = assets.filter(a => a.status === 'warning' || a.status === 'high_risk').length;
  const normalCount = assets.filter(a => a.status === 'normal').length;

  const filteredAssets = assets.filter(a => {
    if (filter === 'critical') return a.status === 'critical';
    if (filter === 'warning') return a.status === 'warning' || a.status === 'high_risk';
    if (filter === 'normal') return a.status === 'normal';
    return true;
  });

  return (
    <div class="space-y-6">
      {/* Executive KPI Cards */}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-panel p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-2xl text-blue-400">⚡</div>
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Total Assets Monitored</div>
            <div class="text-2xl font-extrabold font-mono text-white">{assets.length}</div>
            <div class="text-[10px] text-slate-400">Substation Bay Alpha</div>
          </div>
        </div>

        <div class="glass-panel p-4 flex items-center gap-4 border-red-500/40">
          <div class="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-2xl text-red-400 pulse-red-glow">🔥</div>
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase">Critical Thermal Faults</div>
            <div class="text-2xl font-extrabold font-mono text-red-400">{criticalCount}</div>
            <div class="text-[10px] text-red-400 font-semibold">Immediate Shutdown Required</div>
          </div>
        </div>

        <div class="glass-panel p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-2xl text-amber-400">⚠️</div>
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase">High Risk & Warnings</div>
            <div class="text-2xl font-extrabold font-mono text-amber-400">{warningCount}</div>
            <div class="text-[10px] text-slate-400">Scheduled Maintenance</div>
          </div>
        </div>

        <div class="glass-panel p-4 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl text-emerald-400">🛡️</div>
          <div>
            <div class="text-[10px] font-bold text-slate-400 uppercase">System Health Index</div>
            <div class="text-2xl font-extrabold font-mono text-emerald-400">74.2 %</div>
            <div class="text-[10px] text-slate-400">NETA Anomaly Score</div>
          </div>
        </div>
      </div>

      {/* Asset Inventory Header & Filter Buttons */}
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-bold tracking-wider text-slate-200 uppercase">Facility Electrical Asset Inventory</h3>
        <div class="flex gap-2">
          {['all', 'critical', 'warning', 'normal'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              class={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              {f} ({f === 'all' ? assets.length : f === 'critical' ? criticalCount : f === 'warning' ? warningCount : normalCount})
            </button>
          ))}
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAssets.map(asset => {
          const deltaT = (asset.currentScanTemp - asset.referenceTemp).toFixed(1);
          const badgeClass =
            asset.status === 'critical' ? 'bg-red-500/25 text-red-400 border-red-500' :
            asset.status === 'high_risk' ? 'bg-orange-500/20 text-orange-400 border-orange-500' :
            asset.status === 'warning' ? 'bg-amber-500/20 text-amber-400 border-amber-500' :
            'bg-emerald-500/20 text-emerald-400 border-emerald-500';

          const tempColor =
            asset.status === 'critical' ? 'text-red-400' :
            asset.status === 'high_risk' ? 'text-orange-400' :
            asset.status === 'warning' ? 'text-amber-400' :
            'text-emerald-400';

          return (
            <div
              key={asset.id}
              onClick={() => {
                onSelectAsset(asset);
                onNavigate('inspector');
              }}
              class="glass-panel p-4 hover:border-cyan-500/60 transition-all cursor-pointer space-y-3 hover:-translate-y-0.5"
            >
              <div class="flex items-start justify-between">
                <div>
                  <div class="font-mono font-extrabold text-cyan-400 text-sm">{asset.id}</div>
                  <div class="text-xs text-slate-300 font-medium">{asset.name}</div>
                </div>
                <span class={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${badgeClass}`}>
                  {asset.status.toUpperCase()}
                </span>
              </div>

              <div class="bg-slate-950/60 p-3 rounded-lg flex justify-between items-center text-xs">
                <div>
                  <div class="text-[9px] text-slate-400">Scan Temp</div>
                  <div class={`text-base font-bold ${tempColor}`}>{asset.currentScanTemp} °C</div>
                </div>
                <div>
                  <div class="text-[9px] text-slate-400">Baseline</div>
                  <div class="text-base font-bold text-slate-200">{asset.referenceTemp} °C</div>
                </div>
                <div>
                  <div class="text-[9px] text-slate-400">ΔT Anomaly</div>
                  <div class={`text-base font-bold ${tempColor}`}>+{deltaT} °C</div>
                </div>
              </div>

              <div class="text-[10px] text-slate-400 flex items-center justify-between">
                <span>📍 {asset.zone}</span>
                <span class="text-cyan-400 font-semibold">Inspect Thermal →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
