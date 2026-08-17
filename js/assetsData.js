/**
 * ThermoSentinel AI - Asset Data Model & Inspection Database
 */

export const ASSET_STATUSES = {
  NORMAL: { id: 'normal', label: 'Normal', color: '#00e676', bg: 'rgba(0, 230, 118, 0.15)', border: '#00e676', badge: 'STATUS-NORMAL' },
  WARNING: { id: 'warning', label: 'Warning', color: '#ffab00', bg: 'rgba(255, 171, 0, 0.15)', border: '#ffab00', badge: 'STATUS-WARNING' },
  HIGH_RISK: { id: 'high_risk', label: 'High Risk', color: '#ff6d00', bg: 'rgba(255, 109, 0, 0.15)', border: '#ff6d00', badge: 'STATUS-HIGH-RISK' },
  CRITICAL: { id: 'critical', label: 'Critical', color: '#ff5252', bg: 'rgba(255, 82, 82, 0.2)', border: '#ff5252', badge: 'STATUS-CRITICAL' }
};

export const INITIAL_ASSETS = [
  {
    id: 'TX-101',
    name: '138kV Step-Down Transformer 1',
    category: 'Transformer',
    zone: 'Substation Yard - Zone A',
    status: 'critical',
    mapCoords: { x: 220, y: 160 },
    waypointIndex: 1,
    ambientTemp: 28.5,
    referenceTemp: 45.0,
    currentScanTemp: 89.4,
    ratedCurrent: 800,
    actualCurrent: 736,
    loadPercentage: 92,
    hotspotTarget: 'Phase B High-Voltage Bushing Connector',
    hotspotPos: { x: 42, y: 38 },
    hotspotRadius: 28,
    diagnosis: 'Severe thermal anomaly detected on Phase B bushing connector. Delta T of +44.4°C exceeds critical threshold (NETA > 40°C). High risk of thermal failure or arc fault.',
    recommendedAction: 'EMERGENCY: Immediately de-energize and isolate TX-101. Inspect Phase B bushing terminal, check bolt torque (target 55 Nm), clean oxidized copper contact surfaces, replace damaged insulation sleeves.',
    lastScanDate: '2026-08-13 14:15:00',
    history: [
      { date: '2026-03-01', temp: 45.2, load: 78, deltaT: 0.2, status: 'normal' },
      { date: '2026-04-15', temp: 47.8, load: 80, deltaT: 2.8, status: 'normal' },
      { date: '2026-05-30', temp: 53.4, load: 82, deltaT: 8.4, status: 'normal' },
      { date: '2026-06-20', temp: 63.1, load: 18.1, deltaT: 18.1, status: 'warning' },
      { date: '2026-07-28', temp: 74.6, load: 88, deltaT: 29.6, status: 'high_risk' },
      { date: '2026-08-13', temp: 89.4, load: 92, deltaT: 44.4, status: 'critical' }
    ]
  },
  {
    id: 'SG-04B',
    name: '13.8kV Vacuum Circuit Breaker SG-04B',
    category: 'Switchgear',
    zone: 'Switchgear Building - Bay 2',
    status: 'high_risk',
    mapCoords: { x: 480, y: 140 },
    waypointIndex: 2,
    ambientTemp: 26.0,
    referenceTemp: 38.0,
    currentScanTemp: 68.2,
    ratedCurrent: 1200,
    actualCurrent: 1008,
    loadPercentage: 84,
    hotspotTarget: 'Phase C Lower Cable Terminal Lug',
    hotspotPos: { x: 65, y: 48 },
    hotspotRadius: 22,
    diagnosis: 'Elevated thermal resistance on Phase C breaker terminal lug. Delta T of +30.2°C indicates loose bolted connection under heavy load.',
    recommendedAction: 'Schedule maintenance shutdown within 24 hours. De-energize SG-04B, inspect for loose hardware, perform micro-ohm resistance test across contacts, retorque bolts to manufacturer spec.',
    lastScanDate: '2026-08-13 14:18:30',
    history: [
      { date: '2026-03-01', temp: 38.2, load: 72, deltaT: 0.2, status: 'normal' },
      { date: '2026-04-15', temp: 39.5, load: 75, deltaT: 1.5, status: 'normal' },
      { date: '2026-05-30', temp: 44.0, load: 76, deltaT: 6.0, status: 'normal' },
      { date: '2026-06-20', temp: 52.8, load: 80, deltaT: 14.8, status: 'warning' },
      { date: '2026-07-28', temp: 60.1, load: 82, deltaT: 22.1, status: 'high_risk' },
      { date: '2026-08-13', temp: 68.2, load: 84, deltaT: 30.2, status: 'high_risk' }
    ]
  },
  {
    id: 'MCC-02',
    name: 'Auxiliary Water Pump Motor Starter MCC-02',
    category: 'Motor Control',
    zone: 'Pump House - Room 1',
    status: 'warning',
    mapCoords: { x: 680, y: 260 },
    waypointIndex: 3,
    ambientTemp: 27.0,
    referenceTemp: 35.0,
    currentScanTemp: 54.1,
    ratedCurrent: 400,
    actualCurrent: 312,
    loadPercentage: 78,
    hotspotTarget: 'Contactor Relay 3 Contact Tips',
    hotspotPos: { x: 34, y: 55 },
    hotspotRadius: 18,
    diagnosis: 'Moderate localized temperature elevation at Contactor 3 pole tips. Delta T of +19.1°C suggests contact surface pitting or spring tension loss.',
    recommendedAction: 'Plan inspection during upcoming maintenance window. Inspect contactor tips for electrical erosion, clean contact surfaces or replace contactor kit if pitting exceeds 1mm.',
    lastScanDate: '2026-08-13 14:22:10',
    history: [
      { date: '2026-03-01', temp: 35.1, load: 68, deltaT: 0.1, status: 'normal' },
      { date: '2026-04-15', temp: 36.4, load: 70, deltaT: 1.4, status: 'normal' },
      { date: '2026-05-30', temp: 39.8, load: 72, deltaT: 4.8, status: 'normal' },
      { date: '2026-06-20', temp: 45.2, load: 74, deltaT: 10.2, status: 'warning' },
      { date: '2026-07-28', temp: 49.7, load: 75, deltaT: 14.7, status: 'warning' },
      { date: '2026-08-13', temp: 54.1, load: 78, deltaT: 19.1, status: 'warning' }
    ]
  },
  {
    id: 'CB-01',
    name: '500 kVAR Power Factor Capacitor Bank',
    category: 'Capacitor Bank',
    zone: 'Outdoor Switchyard - Zone C',
    status: 'normal',
    mapCoords: { x: 540, y: 440 },
    waypointIndex: 4,
    ambientTemp: 28.0,
    referenceTemp: 34.0,
    currentScanTemp: 36.5,
    ratedCurrent: 300,
    actualCurrent: 195,
    loadPercentage: 65,
    hotspotTarget: 'N/A - Uniform Dissipation',
    hotspotPos: { x: 50, y: 50 },
    hotspotRadius: 10,
    diagnosis: 'Thermal profile normal. Symmetric heat distribution across all three capacitor cans and fuse units. Delta T of +2.5°C within acceptable bounds.',
    recommendedAction: 'Continue routine scheduled drone surveillance. No immediate maintenance required.',
    lastScanDate: '2026-08-13 14:25:40',
    history: [
      { date: '2026-03-01', temp: 34.2, load: 60, deltaT: 0.2, status: 'normal' },
      { date: '2026-04-15', temp: 34.8, load: 62, deltaT: 0.8, status: 'normal' },
      { date: '2026-05-30', temp: 35.1, load: 63, deltaT: 1.1, status: 'normal' },
      { date: '2026-06-20', temp: 35.9, load: 64, deltaT: 1.9, status: 'normal' },
      { date: '2026-07-28', temp: 36.2, load: 65, deltaT: 2.2, status: 'normal' },
      { date: '2026-08-13', temp: 36.5, load: 65, deltaT: 2.5, status: 'normal' }
    ]
  },
  {
    id: 'DS-09',
    name: '138kV Outdoor Gang-Operated Disconnect Switch',
    category: 'Disconnect Switch',
    zone: 'Overhead Line Bay 4',
    status: 'warning',
    mapCoords: { x: 300, y: 400 },
    waypointIndex: 5,
    ambientTemp: 29.0,
    referenceTemp: 36.0,
    currentScanTemp: 48.3,
    ratedCurrent: 1200,
    actualCurrent: 840,
    loadPercentage: 70,
    hotspotTarget: 'Phase A Hinge Contact Jaw',
    hotspotPos: { x: 72, y: 35 },
    hotspotRadius: 16,
    diagnosis: 'Mild thermal gradient detected at Phase A hinge contact. Delta T of +12.3°C caused by atmospheric surface oxidation or grease breakdown.',
    recommendedAction: 'Schedule routine maintenance during next line outage. Clean contact jaw with wire brush, apply silver-plated conductive contact grease.',
    lastScanDate: '2026-08-13 14:28:15',
    history: [
      { date: '2026-03-01', temp: 36.1, load: 65, deltaT: 0.1, status: 'normal' },
      { date: '2026-04-15', temp: 37.0, load: 66, deltaT: 1.0, status: 'normal' },
      { date: '2026-05-30', temp: 39.5, load: 68, deltaT: 3.5, status: 'normal' },
      { date: '2026-06-20', temp: 42.8, load: 70, deltaT: 6.8, status: 'normal' },
      { date: '2026-07-28', temp: 45.6, load: 70, deltaT: 9.6, status: 'normal' },
      { date: '2026-08-13', temp: 48.3, load: 70, deltaT: 12.3, status: 'warning' }
    ]
  },
  {
    id: 'MDP-01',
    name: 'Main Power Distribution Panel MDP-01',
    category: 'Distribution Panel',
    zone: 'Control Building - West Wall',
    status: 'normal',
    mapCoords: { x: 140, y: 320 },
    waypointIndex: 6,
    ambientTemp: 24.5,
    referenceTemp: 32.0,
    currentScanTemp: 33.8,
    ratedCurrent: 600,
    actualCurrent: 330,
    loadPercentage: 55,
    hotspotTarget: 'N/A - Normal Balance',
    hotspotPos: { x: 50, y: 50 },
    hotspotRadius: 10,
    diagnosis: 'Distribution panel operating within healthy parameters. All main breaker lugs and busbars show balanced temperature distribution.',
    recommendedAction: 'Maintain monthly drone scan schedule.',
    lastScanDate: '2026-08-13 14:31:00',
    history: [
      { date: '2026-03-01', temp: 32.1, load: 50, deltaT: 0.1, status: 'normal' },
      { date: '2026-04-15', temp: 32.4, load: 52, deltaT: 0.4, status: 'normal' },
      { date: '2026-05-30', temp: 32.9, load: 53, deltaT: 0.9, status: 'normal' },
      { date: '2026-06-20', temp: 33.1, load: 54, deltaT: 1.1, status: 'normal' },
      { date: '2026-07-28', temp: 33.5, load: 55, deltaT: 1.5, status: 'normal' },
      { date: '2026-08-13', temp: 33.8, load: 55, deltaT: 1.8, status: 'normal' }
    ]
  }
];

window.ASSET_STATUSES = ASSET_STATUSES;
window.INITIAL_ASSETS = INITIAL_ASSETS;
