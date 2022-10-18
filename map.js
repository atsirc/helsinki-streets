import credentials from './config.js';
import createPopup from './popup.js';
const geojson = await fetch('./locations.geojson').then( res => res.json());
//If not using continous deploymetn use the below setup instead.
//const geojson = await fetch('https://raw.githubusercontent.com/atsirc/helsinki-streets/main/locations.geojson').then( response => response.json());

const map = new maplibregl.Map({
   container: 'map',
   style: `https://api.maptiler.com/maps/${credentials.style}/style.json?key=${credentials.key}`,
   //style: './assets/style_mb.json',
   //style: 'http://tiles.hel.ninja/styles/hel-osm-light/style.json',
   //style: 'mapbox://styles/christanicole/ckvnmcitsd56h14nnpmh7lzhz',
   accessToken: credentials.mb_token,
   center: [24.93815, 60.18105],
   zoom: 12,
   minZoom: 12,
   maxZoom: 19 
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

map.addControl( new maplibregl.NavigationControl(), 'top-right' );

// Initialize
map.on('load', () => {
   map.loadImage('assets/map_marker_2.png', (error, image) => {
     if (error) {
       throw error;
     }

     map.addImage('custom-marker', image);
     map.addSource('places', {
       'type': 'geojson',
       'data': geojson,
       'cluster': true,
       'clusterMaxZoom': 14,
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

     /**
      * When a click event occurs on a feature in the places layer, open a popup at the
      * location of the feature, with id for image properties.
      */
     map.on('click', 'unclustered-point', (ev) => {
       const coordinates = ev.features[0].geometry.coordinates.slice();
       const imageId = ev.features[0].properties.id;
       let flying = true;

       map.flyTo({
         center: [coordinates[0], coordinates[1]],
         zoom: 18
       });

       map.on('moveend', (ev) => {
         if (flying) {
           createPopup(map, imageId, coordinates);
           flying = false;
         }
       });
     });

    // Change the cursor to a pointer when the mouse is over the places layer.
     map.on('mouseenter', 'unclustered-point', () => {
       map.getCanvas().style.cursor = 'pointer';
     });

     // Change it back to a pointer when it leaves.
     map.on('mouseleave', 'unclustered-point', () => {
       map.getCanvas().style.cursor = '';
     });
   });
});
