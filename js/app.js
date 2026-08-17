/**
 * ThermoSentinel AI - Map-Centric Tactical Application Controller
 */

import { INITIAL_ASSETS, ASSET_STATUSES } from './assetsData.js';
import { FacilityMap } from './facilityMap.js';
import { DroneSimulator } from './droneSimulator.js';
import { ThermalInspector } from './thermalInspector.js';
import { AIAnalytics } from './aiAnalytics.js';
import { ReportGenerator } from './reports.js';

class ThermoSentinelApp {
  constructor() {
    this.assets = [...INITIAL_ASSETS];
    this.selectedAsset = this.assets[0]; // TX-101
    this.activeDrawerTab = 'fleet';
    this.isDrawerExpanded = false;

    this.initClock();
    this.initFacilityMap();
    this.initDroneSimulator();
    this.initThermalInspector();
    this.initAnalytics();
    this.initDrawerControls();

    this.renderFleetCards();
    this.renderReportsView();
  }

  initClock() {
    const clockEl = document.getElementById('hud-clock');
    const update = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, '0');
      const str = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      if (clockEl) clockEl.innerText = str;
    };
    update();
    setInterval(update, 1000);
  }

  initFacilityMap() {
    this.facilityMap = new FacilityMap('facility-canvas', {
      assets: this.assets,
      onSelectAsset: (assetId) => {
        const asset = this.assets.find(a => a.id === assetId);
        if (asset) {
          this.selectedAsset = asset;
          this.thermalInspector.loadAsset(asset);
          this.facilityMap.setSelectedAsset(asset.id);
          this.renderAnalyticsView();
          this.renderFleetCards();
          this.renderReportsView();
        }
      }
    });
    this.facilityMap.setSelectedAsset(this.selectedAsset.id);
  }

  initDroneSimulator() {
    this.droneSim = new DroneSimulator(
      this.assets,
      (data) => {
        if (this.facilityMap) {
          this.facilityMap.setDronePosition(data.dronePos);
        }

        document.getElementById('t-state').innerText = data.state;
        document.getElementById('t-alt').innerText = `${data.telemetry.altitude.toFixed(1)} m`;
        document.getElementById('t-speed').innerText = `${data.telemetry.speed} m/s`;
        document.getElementById('t-wp').innerText = `WP${data.currentWaypointIndex + 1}`;
        document.getElementById('top-drone-battery').innerText = `${data.telemetry.battery.toFixed(1)}%`;
      },
      (targetAsset) => {
        this.selectedAsset = targetAsset;
        if (this.facilityMap) this.facilityMap.setSelectedAsset(targetAsset.id);
        if (this.thermalInspector) this.thermalInspector.loadAsset(targetAsset);
        this.renderAnalyticsView();
        this.renderFleetCards();
        this.renderReportsView();
      }
    );

    document.getElementById('btn-flight-start').addEventListener('click', () => {
      this.droneSim.startMission();
    });

    document.getElementById('btn-flight-pause').addEventListener('click', () => {
      this.droneSim.pauseMission();
    });

    document.getElementById('btn-flight-rth').addEventListener('click', () => {
      this.droneSim.returnToHome();
    });
  }

  initThermalInspector() {
    this.thermalInspector = new ThermalInspector();
    this.thermalInspector.loadAsset(this.selectedAsset);

    // PIP Expand size button
    const pipWindow = document.getElementById('floating-pip-window');
    document.getElementById('btn-toggle-pip-size').addEventListener('click', () => {
      pipWindow.classList.toggle('expanded-pip');
    });
  }

  initAnalytics() {
    this.analytics = new AIAnalytics('history-chart-canvas');
    this.renderAnalyticsView();
  }

  initDrawerControls() {
    const drawer = document.getElementById('bottom-mission-drawer');
    const toggleBtn = document.getElementById('btn-toggle-drawer');
    const tabs = document.querySelectorAll('.drawer-tab');

    const toggleDrawer = (expand) => {
      if (expand !== undefined) this.isDrawerExpanded = expand;
      else this.isDrawerExpanded = !this.isDrawerExpanded;

      drawer.classList.toggle('collapsed', !this.isDrawerExpanded);
      toggleBtn.innerText = this.isDrawerExpanded ? '▼ COLLAPSE DRAWER' : '▲ EXPAND DRAWER';

      if (this.isDrawerExpanded && this.activeDrawerTab === 'analytics') {
        setTimeout(() => this.renderAnalyticsView(), 100);
      }
    };

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDrawer();
    });

    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.stopPropagation();
        const tabId = tab.dataset.tab;
        this.activeDrawerTab = tabId;

        tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabId));
        document.querySelectorAll('.drawer-tab-pane').forEach(pane => {
          pane.classList.toggle('active', pane.id === `tab-content-${tabId}`);
        });

        if (!this.isDrawerExpanded) {
          toggleDrawer(true);
        } else if (tabId === 'analytics') {
          setTimeout(() => this.renderAnalyticsView(), 100);
        }
      });
    });
  }

  renderFleetCards() {
    const container = document.getElementById('dashboard-assets-grid');
    if (!container) return;
    container.innerHTML = '';

    this.assets.forEach(asset => {
      const deltaT = (asset.currentScanTemp - asset.referenceTemp).toFixed(1);
      const isSelected = asset.id === this.selectedAsset.id;

      const card = document.createElement('div');
      card.className = `asset-card-mini ${isSelected ? 'selected' : ''}`;
      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong class="font-mono text-cyan">${asset.id}</strong>
          <span class="badge ${asset.status === 'critical' ? 'red' : asset.status === 'warning' ? 'warning' : asset.status === 'high_risk' ? 'orange' : 'green'}">${asset.status.toUpperCase()}</span>
        </div>
        <div style="font-size: 10px; color: #94a3b8;">${asset.name}</div>
        <div style="display: flex; justify-content: space-between; font-size: 10px; margin-top: 4px;">
          <span>Scan: <strong class="text-${asset.status}">${asset.currentScanTemp}°C</strong></span>
          <span>ΔT: <strong class="text-${asset.status}">+${deltaT}°C</strong></span>
        </div>
      `;

      card.addEventListener('click', () => {
        this.selectedAsset = asset;
        this.facilityMap.setSelectedAsset(asset.id);
        this.thermalInspector.loadAsset(asset);
        this.renderAnalyticsView();
        this.renderFleetCards();
        this.renderReportsView();
      });

      container.appendChild(card);
    });
  }

  renderAnalyticsView() {
    const asset = this.selectedAsset;
    const nameEl = document.getElementById('analytics-asset-name');
    if (nameEl) nameEl.innerText = `${asset.id} - ${asset.name}`;

    const riskData = AIAnalytics.calculateRiskScore(asset);
    document.getElementById('ai-risk-score').innerText = `${riskData.riskScore} / 100`;
    document.getElementById('ai-meas-temp').innerText = `${asset.currentScanTemp} °C`;
    document.getElementById('ai-ref-temp').innerText = `${asset.referenceTemp} °C`;
    document.getElementById('ai-delta-t').innerText = `+${riskData.deltaT} °C`;
    document.getElementById('ai-corr-temp').innerText = `${riskData.correctedTemp} °C`;
    document.getElementById('ai-diagnosis-text').innerText = asset.diagnosis;

    this.analytics.renderHistoricalChart(asset, 'history-chart-canvas');
  }

  renderReportsView() {
    const listEl = document.getElementById('reports-asset-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    this.assets.forEach(asset => {
      const btn = document.createElement('button');
      btn.className = `report-mini-btn ${asset.id === this.selectedAsset.id ? 'active' : ''}`;
      btn.innerText = `${asset.id} - ${asset.status.toUpperCase()}`;

      btn.addEventListener('click', () => {
        this.selectedAsset = asset;
        this.renderReportsView();
      });

      listEl.appendChild(btn);
    });

    const docContainer = document.getElementById('report-document-container');
    if (docContainer) {
      docContainer.innerHTML = ReportGenerator.generateWorkOrderHTML(this.selectedAsset);
    }

    document.getElementById('btn-print-report')?.addEventListener('click', () => {
      window.print();
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new ThermoSentinelApp();
});
