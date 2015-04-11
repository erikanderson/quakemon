# quakemon

Live site: https://quakemon.com

## Zip code import 

```
wget http://media.mongodb.org/zips.json?_ga=1.225263507.865733937.1428769828

mv zips.json\?_ga\=1.225263507.865733937.1428769828 zips.json

mongoimport --db quakemon --collection zips zips.json
```

## Resources

- http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
- http://docs.mongodb.org/manual/tutorial/aggregation-zip-code-data-set/

## Dependencies

- https://angularjs.org/
- https://www.mongodb.org/
- https://nodejs.org/
