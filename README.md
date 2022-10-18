# helsinki-streets

Web app displaying Helsinki City Museum's photographs on a map. Using the Finna.fi api (https://www.kiwi.fi/pages/viewpage.action?pageId=53839221). Focus is on changes in the city landscape.
  
Created with MapLibre Gl JS and MapTiles, as well some traditional HTML and JS.
  
Visit site [here!](https://karttest.calmbush-bbb24782.northeurope.azurecontainerapps.io/ "Helsinki street map")
  
# Test app in local environment

This is actually not needed. The app itself is just plain html & javascript. It is mostly here for me to remember :).

Instructions:
  
run ```docker build -t karttest .```
  
then ```docker run -p 81:80 karttest```
  
open http://localhost:81 in browser
  
# add & fixIds folders
  
Both are hastily put together.
The **add** folder contains code for adding points to geojson, while the **fixIds** was created to convert from older id's to newer. Possibly this was unnescessary.
Both use a couple of node libraries.
