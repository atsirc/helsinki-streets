import fs from 'fs';
import express from 'express';
import {addPoint, updateIds, updateFile} from './handleData.js';
const filePath = './../locations.geojson';
const locations =  JSON.parse(fs.readFileSync(filePath, 'utf8'));
const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/', express.static('html'));

app.post('/add-point', (request, response) => {
  try {
    const updatedLocations = addPoint(request, locations);
    updateFile(filePath, updatedLocations);
    response.redirect('/');
  } catch (ex) {
    response.send(ex);
  }
});

app.get('/fix-ids', async (request, response) => {
  const updatedIds = await updateIds(locations);
  updateFile(filePath, updatedIds);
  response.redirect('/');
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
