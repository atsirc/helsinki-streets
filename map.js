import credentials from './config.mjs';
const geojson = await fetch('./locations.geojson').then( res => res.json());
import createPopup from './popup.js';
const map = new maplibregl.Map({
   container: 'map',
   style: `https://api.maptiler.com/maps/${credentials.style}/style.json?key=${credentials.key}`,
   //style: './assets/style.json',
   //accessToken: credentials.mb_token,
   center: [24.93815, 60.18105],
   zoom: 12,
   minZoom: 12,
   maxZoom: 18 
});

 // Add geolocate control to the map.
map.addControl(
  new maplibregl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
    },
    fitBoundsOptions: {
      maxZoom:0 
    },
    trackUserLocation: true,
    showAccuracyCircle: false
  })
);

map.on('load', () => {
   map.loadImage('map_marker_2.png', (error, image) => {
     if (error) {
       throw error;
     }
     map.addImage('custom-marker', image);
     map.addSource('places', {
       'type': 'geojson',
       'data': geojson,
       'cluster': true,
       'clusterMaxZoom': 2,
       'clusterRadius': 50
     });

     map.addLayer({
       'id': 'unclustered-point',
       'type': 'symbol',
       'source': 'places',
       'filter': ['!', ['has', 'point_count']],
       'layout': {
         'icon-image': 'custom-marker'
       }
     });
  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
     map.on('click', 'unclustered-point', function (e) {
       const coordinates = e.features[0].geometry.coordinates.slice();
       const properties = e.features[0].properties;
       let flying = true;
       map.flyTo({
         center: [coordinates[0], coordinates[1] + 0.00070],
         zoom: 17
       });

       map.on('moveend', function(ev){
         if (flying) {
           createPopup(map, properties, coordinates);
           flying = false;
         }
       });
   });
// Change the cursor to a pointer when the mouse is over the places layer.
     map.on('mouseenter', 'unclustered-point', function () {
       map.getCanvas().style.cursor = 'pointer';
     });

     // Change it back to a pointer when it leaves.
     map.on('mouseleave', 'unclustered-point', function () {
       map.getCanvas().style.cursor = '';
     });
   });
});
