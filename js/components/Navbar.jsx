/**
 * ThermoSentinel AI - React Top Navbar Component
 */

window.Navbar = function Navbar({ droneState, battery, onStartMission }) {
  const [clockStr, setClockStr] = React.useState('');

  React.useEffect(() => {
    const update = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      setClockStr(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header class="glass-panel mx-3 mt-3 px-6 py-3 flex items-center justify-between z-50">
      {/* Brand */}
      <div class="flex items-center gap-3">
        <div class="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v20M2 12h20M7 7l10 10M17 7L7 17"/>
            <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.2"/>
          </svg>
        </div>
        <div>
          <h1 class="font-mono text-base font-extrabold tracking-wider text-cyan-400">THERMOSENTINEL AI</h1>
          <p class="text-[9px] tracking-widest text-slate-400 uppercase">Autonomous Industrial Electrical Safety Platform</p>
        </div>
      </div>

      {/* Telemetry Chips */}
      <div class="hidden md:flex items-center gap-6 text-xs">
        <div class="flex flex-col">
          <span class="text-[9px] font-bold text-slate-400 uppercase">Facility</span>
          <span class="font-bold text-cyan-300">SUBSTATION BAY ALPHA</span>
        </div>

        <div class="flex flex-col">
          <span class="text-[9px] font-bold text-slate-400 uppercase">Drone Mission</span>
          <span class={`font-bold px-2 py-0.5 rounded-full text-[10px] ${droneState === 'IDLE' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}`}>
            {droneState}
          </span>
        </div>

        <div class="flex flex-col">
          <span class="text-[9px] font-bold text-slate-400 uppercase">Battery</span>
          <span class="font-mono font-bold text-emerald-400">{battery.toFixed(1)} %</span>
        </div>

        <div class="flex flex-col">
          <span class="text-[9px] font-bold text-slate-400 uppercase">FLIR Payload</span>
          <span class="font-bold text-cyan-400">RADIOMETRIC 3.5 ONLINE</span>
        </div>

        <div class="flex flex-col font-mono text-slate-300 text-xs">
          <span>{clockStr}</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onStartMission}
        class="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        LAUNCH MISSION
      </button>
    </header>
  );
};
