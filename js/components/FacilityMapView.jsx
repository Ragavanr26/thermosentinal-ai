/**
 * ThermoSentinel AI - React Facility Map Component
 */

window.FacilityMapView = function FacilityMapView({ assets, selectedAsset, onSelectAsset, droneSim }) {
  const canvasRef = React.useRef(null);
  const facilityMapRef = React.useRef(null);

  React.useEffect(() => {
    if (!facilityMapRef.current && window.FacilityMap) {
      facilityMapRef.current = new window.FacilityMap('facility-canvas', {
        assets: assets,
        onSelectAsset: (assetId) => {
          const found = assets.find(a => a.id === assetId);
          if (found) onSelectAsset(found);
        }
      });
    }

    if (facilityMapRef.current && selectedAsset) {
      facilityMapRef.current.setSelectedAsset(selectedAsset.id);
    }
  }, [assets, selectedAsset]);

  return (
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      {/* Map Canvas */}
      <div class="lg:col-span-2 glass-panel p-4 flex flex-col h-[520px]">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-xs font-bold tracking-wider text-slate-200 uppercase">Substation Bay Alpha Digital Vector Map</h3>
          <div class="flex items-center gap-3 text-[10px]">
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-emerald-400"></span> Normal</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Warning</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-orange-400"></span> High Risk</span>
            <span class="flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-red-400"></span> Critical</span>
          </div>
        </div>

        <div class="flex-1 relative rounded-lg overflow-hidden border border-slate-700/50 bg-slate-950">
          <canvas id="facility-canvas" ref={canvasRef} class="w-full h-full block"></canvas>
        </div>
      </div>

      {/* Flight Control & Telemetry Panel */}
      <div class="glass-panel p-4 flex flex-col justify-between space-y-4">
        <div>
          <h3 class="text-xs font-bold tracking-wider text-slate-200 uppercase mb-3">Flight Controls & Telemetry</h3>
          
          <div class="flex gap-2 mb-4">
            <button
              onClick={() => droneSim && droneSim.startMission()}
              class="flex-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs py-2 rounded-lg transition-all"
            >
              START SCAN
            </button>
            <button
              onClick={() => droneSim && droneSim.pauseMission()}
              class="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-2 rounded-lg border border-slate-700"
            >
              PAUSE
            </button>
            <button
              onClick={() => droneSim && droneSim.returnToHome()}
              class="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/40 font-bold text-xs px-3 py-2 rounded-lg"
            >
              RTH
            </button>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-slate-950/60 p-2.5 rounded-lg">
              <span class="text-[9px] text-slate-400 block">Flight State</span>
              <span class="font-bold text-cyan-400">{droneSim ? droneSim.state : 'IDLE'}</span>
            </div>
            <div class="bg-slate-950/60 p-2.5 rounded-lg">
              <span class="text-[9px] text-slate-400 block">Altitude</span>
              <span class="font-mono font-bold text-slate-200">{droneSim ? `${droneSim.telemetry.altitude.toFixed(1)} m` : '0.0 m'}</span>
            </div>
            <div class="bg-slate-950/60 p-2.5 rounded-lg">
              <span class="text-[9px] text-slate-400 block">Speed</span>
              <span class="font-mono font-bold text-slate-200">{droneSim ? `${droneSim.telemetry.speed} m/s` : '0.0 m/s'}</span>
            </div>
            <div class="bg-slate-950/60 p-2.5 rounded-lg">
              <span class="text-[9px] text-slate-400 block">Target Waypoint</span>
              <span class="font-bold text-amber-400">{droneSim ? `WP${droneSim.currentWaypointIndex + 1}` : 'WP1'}</span>
            </div>
          </div>
        </div>

        {/* Selected Asset Card */}
        {selectedAsset && (
          <div class="glass-panel-cyan p-3 space-y-2">
            <div class="flex justify-between items-center">
              <span class="font-mono font-extrabold text-cyan-400 text-xs">{selectedAsset.id}</span>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {selectedAsset.status.toUpperCase()}
              </span>
            </div>
            <p class="text-xs text-slate-200 font-semibold">{selectedAsset.name}</p>
            <div class="text-[10px] text-slate-400">
              Current Temp: <strong class="text-white">{selectedAsset.currentScanTemp} °C</strong> | ΔT: <strong class="text-cyan-400">+{(selectedAsset.currentScanTemp - selectedAsset.referenceTemp).toFixed(1)} °C</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
