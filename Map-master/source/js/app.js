/* jshint esversion: 6 */
import Leaflet from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';

// Marker
let marker;

// Initializing Map
const tileLayer = Leaflet.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token='Your API key', {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 18,
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  id: 'mapbox/streets-v11',
});

const map = new Leaflet.map('mapid', {
  center: [51.505, -0.09],
  zoom: 13,
});
map.addLayer(tileLayer);

// Handles the click event of map
function onMapClicked(e) {
  if (marker) {
    map.removeLayer(marker);
  }

  // here the marker works as a constructor
  marker = Leaflet.marker([e.latlng.lat, e.latlng.lng], {
    draggable: true,
  })
    .addTo(map)
    .bindPopup(`You clicked the map at ${e.latlng.toString()}`)
    .openPopup();

  marker.on('dragend', (event) => {
    const latlng = event.target.getLatLng();
    console.log(latlng.lat, latlng.lng);
    // you can also write console.log(latlng.lat, event.target._latlng.lng);
  });
  // we also need to make marker dragable,
  // event code is fine, you just need to add options object in marker constructor
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
