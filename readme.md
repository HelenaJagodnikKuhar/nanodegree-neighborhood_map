# Neighborhood Map
My challenge was to make Neighborhood Map App. I did it for my favorite place - Yosemite Falls. It is a responsive web-based application that loads the full-screen map (Google Map API) with search bar functionality and the list view (Wikipedia API). I added some functionality to Wikipedia API.

I've used the [Knockout](http://knockoutjs.com/) framework as required.

## index.html & style.css
Simple HTML and CSS code to support App's UI.

## app.js
- included and managed Google Map API to prepare the map view markers
- included Wikipedia API; loads locations, coordinates, images and titles for the selected location
- handled the event click
- In View Model created 3 observables; titles, search and filtered locations
- toggle menu code

[Demo](https://helenajagodnikkuhar.github.io/nanodegree-neighborhood_map)

### Getting started
Clone the GitHub repository and run the index.html file in your browser. Or you can use the [Demo](https://helenajagodnikkuhar.github.io/nanodegree-neighborhood_map)

### Tech

Responsive web-based application.

* [Knockout](http://knockoutjs.com/) framework for dynamic Javascript UIs
* [Jquery] - JavaScript library 
* [Google Map API] - to load neighborhood map
* [Wikipedia API] - to load locations, coordinates, images and titles of the Falls

### Contributing
Project requirements were written as part of Frontend nanodegree neighborhood_map project submission. I wrote the code from scratch.

### License
The contents of this repository are covered under the [CC BY 3.0 USß](https://creativecommons.org/licenses/by/3.0/us/).