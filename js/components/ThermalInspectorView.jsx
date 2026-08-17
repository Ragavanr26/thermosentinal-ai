/**
 * ThermoSentinel AI - React FLIR Thermal Inspector Component
 */

window.ThermalInspectorView = function ThermalInspectorView({ asset }) {
  const inspectorRef = React.useRef(null);

  React.useEffect(() => {
    if (!inspectorRef.current && window.ThermalInspector) {
      inspectorRef.current = new window.ThermalInspector('inspector-container');
    }

    if (inspectorRef.current && asset) {
      inspectorRef.current.loadAsset(asset);
    }
  }, [asset]);

  return (
    <div class="h-full">
      <div id="inspector-container">
        {/* Rendered by ThermalInspector class instance */}
      </div>
    </div>
  );
};
