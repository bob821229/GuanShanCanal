require([
    "esri/Map",
    "esri/views/MapView",
    "esri/layers/MapImageLayer",
    "esri/layers/support/Sublayer",
    "esri/geometry/Point",
    "esri/tasks/support/Query",
    "esri/Graphic"
  ], function(Map, MapView, MapImageLayer, Sublayer, Point, Query, Graphic) {
  
    // Create a MapImageLayer
    const mapImageLayer = new MapImageLayer({
      url: "YOUR_MAP_IMAGE_LAYER_URL"
    });
  
    // Create a Map and MapView
    const map = new Map({
      basemap: "streets",
      layers: [mapImageLayer]
    });
  
    const view = new MapView({
      container: "viewDiv",
      map: map,
      center: [YOUR_LONGITUDE, YOUR_LATITUDE], // Set your map center
      zoom: 10
    });
  
    view.when(() => {
      // Ensure the map image layer is loaded
      const pointSublayer = mapImageLayer.findSublayerById(YOUR_POINT_LAYER_ID);
  
      // Listen for click events on the view
      view.on("click", function(event) {
        // Set up a point at the click location
        const queryPoint = new Point({
          longitude: event.mapPoint.longitude,
          latitude: event.mapPoint.latitude
        });
  
        // Set up a query
        const query = pointSublayer.createQuery();
        query.geometry = queryPoint;
        query.spatialRelationship = "intersects";
        query.returnGeometry = true;
        query.outFields = ["*"];  // Retrieve all fields
  
        // Execute the query
        pointSublayer.queryFeatures(query).then(function(result) {
          if (result.features.length > 0) {
            result.features.forEach(function(feature) {
              // Display the attributes of the point clicked
              console.log("Feature attributes:", feature.attributes);
  
              // Optionally, create a graphic to show the point
              const pointGraphic = new Graphic({
                geometry: feature.geometry,
                symbol: {
                  type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
                  color: [255, 0, 0],
                  size: 8
                }
              });
              view.graphics.add(pointGraphic);
            });
          } else {
            console.log("No point features found at the click location.");
          }
        }).catch(function(error) {
          console.error("Error querying features:", error);
        });
      });
    });
  });