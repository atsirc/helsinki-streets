export default async function createPopup (map,  properties, coordinates) {
  const response = await fetch(`https://api.finna.fi/v1/record?id=${properties.id}`)
  const json = await response.json();
  const records = json.records[0];
  console.log(records);
  const src = `https://api.finna.fi/Cover/Show?id=${properties.id}&size=small`;
  const link = `https://www.helsinkikuvia.fi/search/details/?image_id=${records.id}`;
  new maplibregl.Popup({maxWidth: 'none', focusAfterOpen: false})
    .setLngLat(coordinates)
    .setHTML(
      `<img src="${src}" width="100%"/>
       <h1>${records['title']}</h1>
       <p><b>kommentit:</b> ${properties.comments}</p>
       <p><b>asiansanat:</b> ${records['subjects'].join(", ")}</p>
       <p><b>linkki parempaan kuvaan:</b> <a href="${link}" target="_blank">${link}</a></p>
    `).addTo(map);
}
