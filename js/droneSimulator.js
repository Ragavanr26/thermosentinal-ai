/**
 * ThermoSentinel AI - Autonomous Drone Flight Simulator & Telemetry Engine
 */

export class DroneSimulator {
  constructor(assets, onUpdateTelemetry, onArriveWaypoint) {
    this.assets = [...assets].sort((a, b) => a.waypointIndex - b.waypointIndex);
    this.onUpdateTelemetry = onUpdateTelemetry || (() => {});
    this.onArriveWaypoint = onArriveWaypoint || (() => {});

    this.homePos = { x: 100, y: 80 };
    this.dronePos = { x: 100, y: 80, angle: 0 };
    this.currentWaypointIndex = 0;
    this.state = 'IDLE';
    this.speedMultiplier = 1;

    this.telemetry = {
      battery: 94.0,
      altitude: 0.0,
      speed: 0.0,
      lat: 37.77492,
      lng: -122.41942,
      pitch: 0,
      roll: 0,
      yaw: 0,
      flirSensorStatus: 'ONLINE (FLIR Lepton 3.5 Radiometric)',
      sensorTemp: 24.2
    };

    this.scanProgress = 0;
    this.timer = null;
    this.lastTime = Date.now();
  }

  startMission() {
    if (this.state === 'IDLE' || this.state === 'PAUSED') {
      this.state = 'TAKING_OFF';
      this.lastTime = Date.now();
      this.loop();
    }
  }

  pauseMission() {
    this.state = 'PAUSED';
    if (this.timer) {
      cancelAnimationFrame(this.timer);
      this.timer = null;
    }
    this.notifyTelemetry();
  }

  returnToHome() {
    this.state = 'RETURNING';
  }

  setSpeed(multiplier) {
    this.speedMultiplier = multiplier;
  }

  loop() {
    if (this.state === 'PAUSED') return;

    const now = Date.now();
    const dt = Math.min((now - this.lastTime) / 1000, 0.1) * this.speedMultiplier;
    this.lastTime = now;

    this.telemetry.battery = Math.max(0, this.telemetry.battery - dt * 0.05);

    switch (this.state) {
      case 'TAKING_OFF':
        this.telemetry.altitude += dt * 5;
        this.telemetry.speed = 1.2;
        if (this.telemetry.altitude >= 15.0) {
          this.telemetry.altitude = 15.0;
          this.state = 'NAVIGATING';
        }
        break;

      case 'NAVIGATING':
        this.telemetry.altitude = 15.0 + Math.sin(now / 500) * 0.4;
        const targetAsset = this.assets[this.currentWaypointIndex];
        if (!targetAsset) {
          this.state = 'RETURNING';
          break;
        }

        const targetX = targetAsset.mapCoords.x;
        const targetY = targetAsset.mapCoords.y;

        const dx = targetX - this.dronePos.x;
        const dy = targetY - this.dronePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const targetAngle = Math.atan2(dy, dx) * 180 / Math.PI;
        this.dronePos.angle = targetAngle;
        this.telemetry.yaw = (targetAngle + 360) % 360;
        this.telemetry.pitch = -5;
        this.telemetry.roll = Math.sin(now / 300) * 2;

        const moveDist = 75 * dt;
        if (dist <= moveDist) {
          this.dronePos.x = targetX;
          this.dronePos.y = targetY;
          this.telemetry.speed = 0.0;
          this.state = 'SCANNING';
          this.scanProgress = 0;
          this.onArriveWaypoint(targetAsset);
        } else {
          this.dronePos.x += (dx / dist) * moveDist;
          this.dronePos.y += (dy / dist) * moveDist;
          this.telemetry.speed = (moveDist / dt / 10).toFixed(1);
        }
        break;

      case 'SCANNING':
        this.telemetry.speed = 0.0;
        this.telemetry.pitch = -45;
        this.telemetry.roll = 0;
        this.scanProgress += dt * 0.4;

        const currentAsset = this.assets[this.currentWaypointIndex];
        if (currentAsset) {
          this.telemetry.sensorTemp = currentAsset.currentScanTemp;
        }

        if (this.scanProgress >= 1.0) {
          this.currentWaypointIndex++;
          if (this.currentWaypointIndex >= this.assets.length) {
            this.state = 'RETURNING';
          } else {
            this.state = 'NAVIGATING';
          }
        }
        break;

      case 'RETURNING':
        this.telemetry.altitude = 15.0;
        const rdx = this.homePos.x - this.dronePos.x;
        const rdy = this.homePos.y - this.dronePos.y;
        const rdist = Math.sqrt(rdx * rdx + rdy * rdy);

        if (rdist <= 5) {
          this.dronePos.x = this.homePos.x;
          this.dronePos.y = this.homePos.y;
          this.telemetry.altitude -= dt * 4;
          this.telemetry.speed = 0;
          if (this.telemetry.altitude <= 0) {
            this.telemetry.altitude = 0;
            this.state = 'IDLE';
            this.currentWaypointIndex = 0;
          }
        } else {
          const homeAngle = Math.atan2(rdy, rdx) * 180 / Math.PI;
          this.dronePos.angle = homeAngle;
          this.dronePos.x += (rdx / rdist) * 90 * dt;
          this.dronePos.y += (rdy / rdist) * 90 * dt;
          this.telemetry.speed = 4.2;
        }
        break;
    }

    this.telemetry.lat = 37.77492 + (this.dronePos.y - 80) * 0.000005;
    this.telemetry.lng = -122.41942 + (this.dronePos.x - 100) * 0.000005;

    this.notifyTelemetry();

    if (this.state !== 'IDLE' && this.state !== 'PAUSED') {
      this.timer = requestAnimationFrame(() => this.loop());
    }
  }

  notifyTelemetry() {
    this.onUpdateTelemetry({
      dronePos: { ...this.dronePos },
      telemetry: { ...this.telemetry },
      state: this.state,
      currentWaypointIndex: this.currentWaypointIndex,
      scanProgress: this.scanProgress
    });
  }
}

window.DroneSimulator = DroneSimulator;
