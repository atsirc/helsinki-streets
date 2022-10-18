const fetch = require('node-fetch');
const logger = require('./logger');
const filePath = 'locations.geojson';
const apiUrl = 'https://api.finna.fi/v1/record?id=';
const queryString = '&field[]=id';

const getNewId = async (oldId) => {
  try {
    const response = await fetch(apiUrl + oldId + queryString);
    const responseJson = await response.json();
    const newId = responseJson.records[0].id;
    return newId
  } catch (error) {
    console.log(error.message);
  }
};

const loopThroughGeoJSONObj = async () =>{
  const geoJSON = logger.getObject(filePath);
  const features = geoJSON.features;
  for (var feature of features) {
    const newId = await getNewId(feature.properties.id);
    feature.properties.id = newId;
  }

  geoJSON['features'] = features;
  return geoJSON;
}

const updateGeojJSONfile = async () => {
  const newJSONobj = await loopThroughGeoJSONObj();
  logger.updateJSONFile(filePath, newJSONobj);
}

updateGeojJSONfile();