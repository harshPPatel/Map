/* jshint esversion: 6 */
import Leaflet from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// Creating map
const map = Leaflet.map('mapid')
  .setView([51.505, -0.09], 13);

// Marker
let marker;

// Initializing Map
Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
})
  .addTo(map);

// Handles the click event of map
const onMapClicked = (e) => {
  if (marker) {
    map.removeLayer(marker);
  }

  marker = Leaflet.marker([e.latlng.lat, e.latlng.lng])
    .addTo(map)
    .bindPopup(`You clicked the map at ${e.latlng.toString()}`)
    .openPopup();
};

// Adding click event to Map
map.on('click', onMapClicked);

const provider = new OpenStreetMapProvider();

const searchController = new GeoSearchControl({
  provider,
  autoComplete: true,
  autoCompleteDelay: 250,
});

map.addControl(searchController);

// Stopping app for 1 second before running invalidateSize
setTimeout(() => {
  map.invalidateSize();
}, 1000);
