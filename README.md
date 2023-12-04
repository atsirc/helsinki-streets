# Working solution

Visit the map **[here!](https://delightful-plant-0224b2303.4.azurestaticapps.net)**
  
# helsinki-streets - Muuttuva Helsinki

This is web app displaying photographs from Helsinki City Museum's collection. Using the Finna.fi api (https://www.kiwi.fi/pages/viewpage.action?pageId=53839221). Focus is on changes in the city landscape.
  
Created with MapLibre Gl JS and MapTiles, as well some basic HTML, JS and Node stuff.
  
# Test app in local environment

This is actually not needed. The app itself is just plain html & javascript. It is mostly here for me to remember :).

Instructions:
  
run ```docker build -t karttest .```
  
then ```docker run -p 81:80 karttest```
  
open http://localhost:81 in browser
  
# add folder
  
The add folder is an extremely simple (= made without too much thought) node based solution for adding points to the geojson.
It also contains a method for updating the ids for the points, since it at one point in time seemed like the museum was changing the ids :(.
