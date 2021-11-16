const fs = require('fs')
const express = require('express');
const GeoJSON = require('geojson');
const locations =  JSON.parse( fs.readFileSync('./../locations.geojson', 'utf8') )
const app = express()

const PORT = process.env.PORT || 3002

console.log('hej server.js')
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use('/', express.static(__dirname + '/html'))
app.post('/add-point', (request, response) => {
  const body = request.body;
  let link = body.link
  const tmp_coord = body.coordinates.split(/ *[,:] */);
  if (!tmp_coord[1] || tmp_coord[2]) {
    response.send('woring input')
    return;
  }
  const coordinates = tmp_coord[0] > tmp_coord[1] ? [tmp_coord[1], tmp_coord[0]] : tmp_coord;
  link = link.split('=')[1];
  if (!link || link.indexOf('hkm') < 0) {
    response.send('wrong input')
    return;
  }
  const data = { id: link, coords: coordinates}
  const newPoint = GeoJSON.parse(data, {Point: 'coords'});
  locations.features.push(newPoint);
  fs.writeFile('./../locations.geojson', JSON.stringify(locations), 'utf8', (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
  } else {
      console.log(`File is written successfully!`);
  }

                                                                });
  response.redirect('/') 
  });


app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))

