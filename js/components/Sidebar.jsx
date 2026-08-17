/**
 * ThermoSentinel AI - React Sidebar Component
 */

window.Sidebar = function Sidebar({ currentView, onViewChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: '⚡' },
    { id: 'map', label: 'Facility Map & Flight', icon: '🗺️' },
    { id: 'inspector', label: 'FLIR Thermal Inspector', icon: '🔬' },
    { id: 'analytics', label: 'AI Predictive Trends', icon: '📈' },
    { id: 'reports', label: 'Work Orders & Reports', icon: '📋' },
  ];

  return (
    <aside class="w-64 glass-panel p-4 flex flex-col justify-between hidden md:flex">
      <nav class="flex flex-col gap-1.5">
        {menuItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              class={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all w-full text-left ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 border-l-4 border-cyan-400 font-bold'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <span class="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* AI System Badge */}
      <div class="glass-panel-cyan p-3 text-xs">
        <div class="flex items-center gap-2 font-bold text-cyan-400 text-[10px]">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>NETA MTS-2023 ACTIVE</span>
        </div>
        <p class="text-[9px] text-slate-400 mt-1">AI Thermal Anomaly Detection Standard Rules Loaded.</p>
      </div>
    </aside>
  );
};
