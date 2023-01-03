INSERT INTO store (osm_id, name, shop, location)
SELECT
  feature->>'id' as osm_id,
  feature->'properties'->>'name' as name,
  feature->'properties'->>'shop' as shop,
  ST_GeomFromGeoJSON(feature->'geometry') as location
 FROM (
  SELECT '{
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
  }'::jsonb as feature
) t;

SELECT ST_X(location) AS longitude, ST_Y(location) AS latitude FROM store;
