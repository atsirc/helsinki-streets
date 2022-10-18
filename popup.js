export default async function createPopup (map, imageId, coordinates) {
  /*
   * Api get string building.
   *
   * See instructions for how GET string looks like: https://www.kiwi.fi/pages/viewpage.action?pageId=53839221
   *
   * Find the different field names in the schema for the GET response: 
   * https://api.finna.fi/swagger-ui/?url=%2Fapi%2Fv1%3Fswagger#/Record/get_record
   */
  const domainName = 'https://api.finna.fi';
  const fieldStr = '&field[]=';
  const fields = [
    'imagesExtended',
    'title',
    'subjects',
    'openUrl',
    'onlineUrls',
    'nonPresenterAuthors',
    'recordLinks',
    'recordPage',
    'identifierString',
    'imageRights',
    'urls',
    'year',
    'id'
  ];
  const apiUrl = `${domainName}/v1/record?id=${imageId}${fieldStr}${fields.join(fieldStr)}`;

  // Get record
  const response = await fetch(apiUrl);
  const json = await response.json();
  const record = json.records[0];
  console.log(apiUrl)
  console.log(record)

  // Set up info for popup
  // TODO: when it works again change large to small
  const newImageId = record['id'];
  const imageSrc = `${domainName}${record['imagesExtended'][0]['urls']['large']}`;
  const link = `https://www.helsinkikuvia.fi/search/details/?image_id=${imageId}`;
  const title = `${record['title']} (${record['year']})`;
  const photograps = record['nonPresenterAuthors'].map(n => n.name).join(", ");
  const subjects = record['subjects'].join(', ');

  // Set popup settings
  const markerHeight = window.innerHeight*.4;
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

  new maplibregl.Popup({maxWidth: 'none', focusAfterOpen: false, offset: popupOffsets })
    .setLngLat(coordinates)
    .setHTML(
      `<img src="${imageSrc}" width="100%"/>
       <h1>${title}</h1>
       <p><b>Alkuperä:</b> <a href="${link}" target="_blank">Helsingin kaupunginmuseo</a></p>
       <p><b>Kuvaaja(t):</b> ${photograps}</p>
       <p><b>Asiansanat:</b> ${subjects}</p>
    `).addTo(map);
};
