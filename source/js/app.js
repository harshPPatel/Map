/* jshint esversion: 6 */
import Leaflet from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet.locatecontrol';
import MiniMap from 'leaflet-minimap';
import token from '../API_Token';

// Marker
let marker;

// Initializing Map
const streetTileLayer = Leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token.token}`, {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
});

const sateliteTileLayer = Leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token.token}`, {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/satellite-streets-v11',
});

/* eslint-disable */
const map = new Leaflet
  .map('mapid', {
    center: [51.505, -0.09],
    zoom: 13,
    layers: [streetTileLayer, sateliteTileLayer],
  });
/* eslint-enable */

const baseMaps = {
  Satelite: sateliteTileLayer,
  Street: streetTileLayer,
};

Leaflet.control.layers(baseMaps).addTo(map);
/* eslint-enable */
// map.addLayer(tileLayer);

new MiniMap(Leaflet.tileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token.token}`, {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
}), {
  toggleDisplay: true,
  // zoomLevelOffset: -3,
}).addTo(map);

Leaflet.control.locate().addTo(map);

// Handles the click event of map
function onMapClicked(e) {
  if (marker) {
    map.removeLayer(marker);
  }

  // https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=51.990819&lon=4.220295
  fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${e.latlng.lat}&lon=${e.latlng.lng}`)
    .then((data) => data.json())
    .then((res) => {
      marker = Leaflet.marker([e.latlng.lat, e.latlng.lng], {
        draggable: true,
      })
        .addTo(map)
        .bindPopup(res.display_name)
        .openPopup();
      marker.on('dragend', (event) => {
        const latlng = event.target.getLatLng();
        fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latlng.lat}&lon=${latlng.lng}`)
          .then((data2) => data2.json())
          .then((res2) => {
            marker.bindPopup(res2.display_name)
              .openPopup();
          });
      });
    });
}

// Adding click event to Map
map.on('click', onMapClicked);

const provider = new OpenStreetMapProvider();

const searchController = new GeoSearchControl({
  provider,
  autoComplete: true,
  autoCompleteDelay: 150,
  showMarker: true,
  showPopup: true,
  autoClose: true,
  maxMarkers: 4,
  searchLabel: 'Enter Address', // It will change placeholder for search input
});

map.addControl(searchController);

function onResultSelected(e) {
  if (marker) {
    map.removeLayer(marker);
  }

  /* eslint-disable */
  marker = Leaflet.marker([e.marker._latlng.lat, e.marker._latlng.lng], {
    draggable: true,
  })
  .addTo(map)
  .bindPopup(e.location.label)
  .openPopup();

  // right now, we want to get lat and lang of the place where we moved the marker, so we are tapping into dragend event of marker
  marker.on('dragend', (e) => console.log(e));
}

map.on('geosearch/showlocation', (e) => {
  console.log(e);
  onResultSelected(e);
});

setTimeout(() => {
  map.invalidateSize();
}, 100);
