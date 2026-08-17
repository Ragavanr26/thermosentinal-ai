/**
 * ThermoSentinel AI - React App Root Component
 */

function App() {
  const [assets] = React.useState(window.INITIAL_ASSETS || []);
  const [selectedAsset, setSelectedAsset] = React.useState(assets[0] || null);
  const [currentView, setCurrentView] = React.useState('dashboard');
  const [droneState, setDroneState] = React.useState('IDLE');
  const [battery, setBattery] = React.useState(94.0);
  const droneSimRef = React.useRef(null);

  React.useEffect(() => {
    if (!droneSimRef.current && window.DroneSimulator) {
      droneSimRef.current = new window.DroneSimulator(
        assets,
        (data) => {
          setDroneState(data.state);
          setBattery(data.telemetry.battery);
        },
        (targetAsset) => {
          setSelectedAsset(targetAsset);
        }
      );
    }
  }, [assets]);

  const handleStartMission = () => {
    setCurrentView('map');
    if (droneSimRef.current) {
      droneSimRef.current.startMission();
    }
  };

  return (
    <div class="flex flex-col h-screen overflow-hidden">
      {/* Top Navbar */}
      <window.Navbar
        droneState={droneState}
        battery={battery}
        onStartMission={handleStartMission}
      />

      {/* Main Body Layout */}
      <div class="flex flex-1 p-3 gap-3 overflow-hidden">
        {/* Sidebar */}
        <window.Sidebar
          currentView={currentView}
          onViewChange={setCurrentView}
        />

        {/* View Content Port */}
        <main class="flex-1 overflow-y-auto">
          {currentView === 'dashboard' && (
            <window.DashboardView
              assets={assets}
              onSelectAsset={setSelectedAsset}
              onNavigate={setCurrentView}
            />
          )}

          {currentView === 'map' && (
            <window.FacilityMapView
              assets={assets}
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
              droneSim={droneSimRef.current}
            />
          )}

          {currentView === 'inspector' && (
            <window.ThermalInspectorView
              asset={selectedAsset}
            />
          )}

          {currentView === 'analytics' && (
            <window.AITrendsView
              asset={selectedAsset}
            />
          )}

          {currentView === 'reports' && (
            <window.WorkOrdersView
              assets={assets}
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// Mount React App into DOM root
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
