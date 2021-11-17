export default async function createPopup (map,  properties, coordinates) {
  const response = await fetch(`https://api.finna.fi/v1/record?id=${properties.id}`)
  const json = await response.json();
  const records = json.records[0];
  const src = `https://api.finna.fi/Cover/Show?id=${properties.id}&size=small`;
  const link = `https://www.helsinkikuvia.fi/search/details/?image_id=${records.id}`;
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
      `<img src="${src}" width="100%"/>
       <h1>${records['title']}</h1>
       <p><b>asiansanat:</b> ${records['subjects'].join(", ")}</p>
       <p><b>kuvaaja: </b> ${records['nonPresenterAuthors'].map(n => n.name).join(", ")}</p>
       <p><b>alkuperä:</b> <a href="${link}" target="_blank">Helsingin kaupunginmuseo</a></p>
    `).addTo(map);
}
