/**
 * ThermoSentinel AI - React Work Orders & Reports Component
 */

window.WorkOrdersView = function WorkOrdersView({ assets, selectedAsset, onSelectAsset }) {
  const handlePrint = () => {
    window.print();
  };

  const reportHTML = window.ReportGenerator ? window.ReportGenerator.generateWorkOrderHTML(selectedAsset) : '';

  return (
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
      {/* Sidebar List */}
      <div class="glass-panel p-4 flex flex-col space-y-3">
        <h3 class="text-xs font-bold tracking-wider text-slate-200 uppercase">Inspection Work Orders</h3>
        <div class="flex-1 overflow-y-auto space-y-2">
          {assets.map(asset => {
            const isSelected = asset.id === selectedAsset.id;
            return (
              <button
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                class={`w-full p-3 rounded-lg text-left transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-500 text-cyan-400 font-bold'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-900'
                }`}
              >
                <div class="font-mono text-xs font-bold">{asset.id}</div>
                <div class="text-[10px] text-slate-400 truncate">{asset.name}</div>
                <span class={`inline-block mt-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                  asset.status === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {asset.status.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Report Document Viewer */}
      <div class="lg:col-span-3 glass-panel p-4 flex flex-col space-y-4 overflow-y-auto h-[540px]">
        <div class="flex justify-between items-center">
          <h3 class="text-xs font-bold tracking-wider text-slate-200 uppercase">Official Electrical Maintenance Work Order</h3>
          <button
            onClick={handlePrint}
            class="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-lg transition-all"
          >
            🖨️ PRINT / EXPORT PDF REPORT
          </button>
        </div>

        <div
          class="flex-1 bg-white rounded-lg p-6 text-slate-900 overflow-y-auto"
          dangerouslySetInnerHTML={{ __html: reportHTML }}
        ></div>
      </div>
    </div>
  );
};
