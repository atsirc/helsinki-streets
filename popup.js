export default async function createPopup (map, imageId, coordinates) {
  /*
   * Api get string building.
   *
   * See instructions for how GET string looks like: 
   *    https://www.kiwi.fi/pages/viewpage.action?pageId=53839221
   * Find the different field names in the schema for the GET response: 
   *    https://api.finna.fi/swagger-ui/?url=%2Fapi%2Fv1%3Fswagger#/Record/get_record
   */
  const domainName = 'https://api.finna.fi';
  const fieldStr = '&field[]=';
  const fields = [
    'geoCenter',
    'id',
    'identifierString',
    'imagesExtended',
    'nonPresenterAuthors',
    'recordLinks',
    'subjects',
    'summary',
    'title',
    'urls',
    'year',
  ];
  const apiUrl = `${domainName}/v1/record?id=${imageId}${fieldStr}${fields.join(fieldStr)}`;

  // Get record
  const response = await fetch(apiUrl);
  const json = await response.json();
  console.log(json);
  const record = json.records[0];

  // Set up info for popup
  // TODO: when it works again change large to small
  const imageSrc = `${domainName.replace('api.','')}${record.imagesExtended[0].urls.small}`;
  const link = `https://www.helsinkikuvia.fi/search/details/?image_id=${imageId}`;
  const title = `${record.title} (${record.year})`;
  const photograpers = record.nonPresenterAuthors.map(n => n.name.replace(':', '')).join(", ");
  const description = record.summary[0].replace(/[sS]isällön kuvaus: */, '').trim();

  // Set popup settings
  const markerHeight = window.innerHeight*.38;
  const popupOffsets = {
    'top': [0, 0],
    'top-left': [0,0],
    'top-right': [0,0],
    'bottom': [0, markerHeight],
    'bottom-left': [0, markerHeight],
    'bottom-right': [0, markerHeight],
    'left': [0, markerHeight],
    'right': [0, markerHeight]
  };

  return new maplibregl.Popup({
    closeButton: true,
    closeOnMove: true,
    maxWidth: 'none',
    focusAfterOpen: false,
    offset: popupOffsets
  }).setLngLat(coordinates)
    .setHTML(
      `<img src="${imageSrc}" width="100%"/>
       <h1>${title}</h1>
       <p><b>Alkuperä:</b> <a href="${link}" target="_blank">Helsingin kaupunginmuseo</a></p>
       <p><b>Kuvaaja:</b> ${photograpers}</p>
       <p><b>Kuvaus:</b> ${description}</p>
    `).addTo(map);
};
