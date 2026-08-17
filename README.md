# 🚁 ThermoSentinel AI

> **AI-Powered Autonomous Thermal Drone for Predictive Industrial Electrical Safety**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18.0-cyan.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-06b6d4.svg)](https://tailwindcss.com/)
[![Standards](https://img.shields.io/badge/Standards-NETA_MTS--2023_%7C_IEEE_C57.12.00-emerald.svg)](https://www.netaworld.org/)

ThermoSentinel AI is a modern industrial safety control room interface for autonomous thermal drones. It monitors critical electrical infrastructure (transformers, vacuum circuit breakers, motor control centers, capacitor banks, disconnect switches, and panelboards), detects thermal anomalies ($\Delta T$), computes NETA MTS-2023 risk indices, and predicts electrical degradation trends.

---

## ✨ Features

- **🚁 60 FPS Animated Quadcopter Drone Flight Simulator**:
  - Interactive flight mission controls (`▶ START INSPECT`, `⏸ PAUSE`, `🏠 RTH`, `1x / 2x / 5x Speed`).
  - **`🔄 CONTINUOUS PATROL MODE`**: Infinite waypoint inspection looping (`WP1` $\rightarrow$ `WP6` $\rightarrow$ `WP1`...) with live lap counter.
  - Click-to-fly waypoint targeting directly on the digital substation map canvas.

- **🔬 FLIR Dual Thermal & Optical Inspector**:
  - Direct mouse and touch drag functionality on the cyan `↔` divider knob.
  - Dual split slider controls (`0% RGB Optical` to `100% FLIR Thermal`).
  - Multiple FLIR colormaps (`Ironbow`, `Thermal Rainbow`, `White-Hot`, `Black-Hot`).
  - Hover spot temperature probe ($^\circ\text{C}$).

- **📡 Real-Time Radiometric Sensor Telemetry Stream (10 Hz)**:
  - Scrollable live packet stream emitting timestamps, target IDs, sensor IDs (`FLIR-L35-xxx`), scan temps, operating current ($A$), $\Delta T$ anomalies, and hex frame checksums.

- **📈 AI Predictive Trends & Daily Scan Readings**:
  - 14-Day Daily scan history (`2026-08-01` to `2026-08-15`) displaying day-by-day thermal degradation curves.
  - Time granularity toggle bar (`📅 14-Day Daily` vs `🕒 24-Hr Hourly`).
  - AI Risk Matrix ($94 / 100$) and NETA anomaly diagnostics.

- **📋 Official NETA MTS-2023 Electrical Work Orders**:
  - Automatic work order report generator with load-corrected temperatures ($T_{\text{corrected}}$), AI root-cause analysis, and one-click PDF/Print export.

---

## ⚡ Real Industrial Electrical Equipment Datasets

- **`TX-101`**: *IEEE C57.12.00 25MVA Oil-Immersed 138kV/13.8kV Step-Down Transformer* (Critical: Phase B HV Bushing lug overheating at $89.4^\circ\text{C}$ under 92% load / 736A).
- **`SG-04B`**: *IEEE C37.09 Vacuum Circuit Breaker* (High Risk: Phase C lower cable terminal lug at $68.2^\circ\text{C}$ under 1008A load).
- **`MCC-02`**: *NEMA ICS-2 Motor Control Center Starter* (Warning: Contactor tips at $54.1^\circ\text{C}$ under 312A load).
- **`CB-01`**: *IEEE 18 500 kVAR Capacitor Bank* (Normal: Uniform dissipation at $36.5^\circ\text{C}$).
- **`DS-09`**: *IEEE C37.30 Disconnect Switch* (Warning: Phase A hinge contact jaw at $48.3^\circ\text{C}$ under 840A load).
- **`MDP-01`**: *NEMA PB-1 600A Distribution Panelboard* (Normal: Balanced phase temperature at $33.8^\circ\text{C}$).

---

## 🛠️ Tech Stack

- **Frontend UI**: React 18, Tailwind CSS, Chart.js, HTML5 Canvas 2D.
- **Design System**: Dark HUD Glassmorphism, HSL Thermal Palettes, JetBrains Mono & Inter typography.
- **Backend / Web Server**: Python 3 `http.server`.

---

## 🚀 Quick Start

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ragavanr26/ThermoSentinel-AI.git
   cd ThermoSentinel-AI
   ```

2. **Run the Application**:
   ```bash
   python server.py
   ```

3. **Open in Browser**:
   Navigate to `http://localhost:8000`

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
