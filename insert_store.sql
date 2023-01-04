CREATE TABLE store (
    id serial PRIMARY KEY,
    osm_id text NOT NULL,
    name text ,
    shop text NOT NULL,
    location geometry NOT NULL
);

INSERT INTO store (osm_id, name, shop, location)
SELECT
  feature->>'id' as osm_id,
  feature->'properties'->>'name' as name,
  feature->'properties'->>'shop' as shop,
  ST_GeomFromGeoJSON(feature->'geometry') as location
 FROM (
  SELECT jsonb_array_elements('{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "@id": "node/354449389",
        "brand": "Lidl",
        "brand:wikidata": "Q151954",
        "brand:wikipedia": "en:Lidl",
        "name": "Lidl",
        "opening_hours": "Mo-Fr 07:00-21:00, Sa 07:00-20:00",
        "shop": "supermarket"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          21.712654,
          38.2080319
        ]
      },
      "id": "node/354449389"
    },
    {
      "type": "Feature",
      "properties": {
        "@id": "node/360217468",
        "name": "The Mart",
        "name:en": "The Mart",
        "shop": "supermarket"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          21.7806567,
          38.28931
        ]
      }
    }
  ]
}'::jsonb, 'features') as feature
) t;

SELECT ST_X(location) AS longitude, ST_Y(location) AS latitude FROM store;
