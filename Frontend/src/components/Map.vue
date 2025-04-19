<template>
  <div class="map-container">
    <button class="center-button" @click="goToTrento"><img src="../assets/my-location.png"></button>
    <div class="map" ref="mapContainer" style="height: 100%; width: 100%;"></div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

export default {
  props: {
    activities: {
      type: Array,
      required: true,
    },
    focusedActivity: Object,
  },

  data() {
    return {
      map: null,
      markers: new Map(),
      locationsCache: new Map(),
      isMapInitialized: false,
    };
  },

  watch: {
    activities: {
      handler(newActivities) {
        if (this.map && this.isMapInitialized) {
          this.updateMap(newActivities);
        } else {
          this.$nextTick(() => this.initMap(newActivities));
        }
      },
      immediate: true,
    },

    focusedActivity(newActivity) {
      if (newActivity && newActivity.location) {
        this.map.setView([newActivity.location.lat, newActivity.location.lng], 15);
        const cacheKey = `${newActivity.name}-${newActivity.place}`;
        const marker = this.markers.get(cacheKey);
        if (marker) {
          marker.openPopup();
        }
      } else {
        this.goToTrento();
        this.closeAllPopups();
      }
    },
  },

  methods: {
    initMap(activities) {
      if (this.map || this.isMapInitialized) return;

      const iconPath = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/';
      L.Icon.Default.mergeOptions({
        iconUrl: iconPath + 'marker-icon.png',
        iconRetinaUrl: iconPath + 'marker-icon-2x.png',
        shadowUrl: iconPath + 'marker-shadow.png',
      });

      this.map = L.map(this.$refs.mapContainer, {
        zoomControl: false,
        fadeAnimation: false,
        zoomAnimation: false,
      }).setView([46.068, 11.121], 13);

      L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' +
          '<a href="https://stadiamaps.com/">Stadia Maps</a>',
      }).addTo(this.map);

      L.control.zoom({
        position: 'topright'
      }).addTo(this.map);

      this.isMapInitialized = true;
      this.updateMap(activities);

      // Ascolta il ridimensionamento della finestra
      window.addEventListener('resize', this.updateMapSize);
    },

    updateMapSize() {
      if (this.map) {
        this.map.invalidateSize();  // Ricalcola la dimensione della mappa
      }
    },

    async updateMap(activities) {
      if (!this.map || !this.isMapInitialized) return;

      this.markers.forEach((marker) => {
        marker.remove();
      });
      this.markers.clear();

      for (const activity of activities) {
        if (!activity.place) continue;

        const cacheKey = `${activity.name}-${activity.place}`;

        if (this.locationsCache.has(cacheKey)) {
          activity.location = this.locationsCache.get(cacheKey);
        } else {
          activity.location = await this.geocodeAddress(activity.place);
          if (activity.location) {
            this.locationsCache.set(cacheKey, activity.location);
          }
        }

        if (activity.location && !this.markers.has(cacheKey)) {
          this.addMarker(activity, cacheKey);
        }
      }
    },

    addMarker(activity, cacheKey) {
      if (!this.map || !this.isMapInitialized || !activity.location) return;

      if (this.markers.has(cacheKey)) return;

      const jitter = (value) => value + (Math.random() * 0.0004 - 0.0002);
      const position = [jitter(activity.location.lat), jitter(activity.location.lng)];

      const marker = L.marker(position).addTo(this.map);
      const popupContent = `
        <div class="popup-content">
          <h3>${activity.name}</h3>
          <p>${activity.place}</p>
        </div>
      `;
      marker.bindPopup(popupContent, { minWidth: 250 });

      marker.on('popupclose', () => {
        if (this.map) this.map.invalidateSize();
      });

      this.markers.set(cacheKey, marker);
    },

    closeAllPopups() {
      this.markers.forEach(marker => {
        if (marker.getPopup()) {
          marker.closePopup();
        }
      });
    },

    async geocodeAddress(address) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
        );
        if (response.data.length > 0) {
          return {
            lat: parseFloat(response.data[0].lat),
            lng: parseFloat(response.data[0].lon),
          };
        }
      } catch (error) {
        console.error("Errore nella geocodifica:", error);
      }
      return null;
    },

    goToTrento() {
      if (this.map) {
        this.map.setView([46.068, 11.121], 13);
        this.closeAllPopups();
      }
    },
  },

  beforeDestroy() {
    if (this.map && this.isMapInitialized) {
      this.markers.forEach(marker => marker.remove());
      this.markers.clear();
      this.locationsCache.clear();
      this.map.remove();
      this.map = null;
      this.isMapInitialized = false;

      // Rimuovi l'ascoltatore per il resize
      window.removeEventListener('resize', this.updateMapSize);
    }
  }
}
</script>

<style>
.map-container {
  height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.map {
  height: 100%;
  width: 100%;
}

.center-button {
  position: absolute;
  top: 690px;
  right: 10px;
  z-index: 4000; /* aumenta per stare sopra la mappa e i controlli */
  background-color: #2d3748;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  transition: background 0.3s ease;
}


.center-button:hover {
  background-color: #4a5568;
}

.leaflet-top.leaflet-right {
  top: 70px;
  right: 20px;
}

.leaflet-control-zoom {
  border: none !important;
}

.leaflet-control-zoom-in,
.leaflet-control-zoom-out {
  background-color: #2d3748 !important;
  color: white !important;
  border: none !important;
  border-radius: 9px !important;
  width: 54px;
  height: 54px;
  font-size: 28px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  margin-bottom: 6px;
}

.leaflet-control-zoom-in:hover,
.leaflet-control-zoom-out:hover {
  background-color: #4a5568 !important;
}

.popup-content {
  text-align: center;
  background-color: #2d2d2d;
  color: #f0f0f0;
  padding: 8px;
  border-radius: 6px;
}

.leaflet-popup-content-wrapper {
  background: #2d2d2d;
  color: #eee;
}

.leaflet-popup-tip {
  background: #2d2d2d;
}
</style>
