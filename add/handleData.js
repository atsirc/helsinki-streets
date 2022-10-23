import fs from 'fs';
import axios from 'axios';
import GeoJSON from 'geojson';
const apiUrl = 'https://api.finna.fi/v1/record?id=';
const queryString = '&field[]=id';

const addPoint = (request, locations) => {
  const body = request.body;
  const link = body.link;
  const imageId = link.split('=')[1];
  const tmp_coord = body.coordinates.replace(' ', '').split(/ *[,:] */);

  if (!imageId || imageId.indexOf('hkm') < 0) {
    throw new Error('Wrong input');
  }

  if (!tmp_coord[1] || tmp_coord[2]) {
    throw new Error('Wrong input');
  }

  const coordinates = tmp_coord[0] > tmp_coord[1] ? [tmp_coord[1], tmp_coord[0]] : tmp_coord;
  const data = { id: imageId, coords: coordinates }
  const newPoint = GeoJSON.parse(data, {Point: 'coords'});
  locations.features.push(newPoint);

  return locations;
}

const getNewId = async (oldId) => {
  try {
    const response = await axios.get(apiUrl + oldId + queryString);
    const newId = response.data.records[0].id;
    return newId
  } catch (error) {
    console.log(error.message);
  }
};

const updateIds = async (locations) => {
  const features = locations.features;
  let updatedIds = 0;

  for (const feature of features) {
    const oldId = feature.properties.id;

    // Newer ids contain - so don't run if the id has already been updated.
    if (oldId && oldId.indexOf('-') === -1) {
      const newId = await getNewId(feature.properties.id);
      if (newId !== oldId) {
        feature.properties.id = newId;
        updatedIds++;
      }
    }
  }

  console.log(updatedIds +' id\'s have been changed since last run');
  locations.features = features;

  return locations;
}

const updateFile = (filePath, locations) => {
  const allLocations = locations.features.length;
  fs.writeFile( filePath , JSON.stringify(locations), 'utf8', (err) => {
    if (err) {
      console.log(`Error writing file: ${err}`);
    } else {
      console.log(`Location count: ` + allLocations);
    }
  });
};

export {
  addPoint,
  updateFile,
  updateIds
};
