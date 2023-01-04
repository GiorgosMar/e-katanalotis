//Αυτό είναι το σκριπτακι σε node που κάνει insert το geoJson αρχείο στη βάση.

const Pool = require("pg").Pool;
const fs = require("fs");


const pool = new Pool({
  user: "postgres",
  password: "walter12@",
  host: "localhost",
  port: 5432,
  database: "greek"
});

const geojson= JSON.parse(fs.readFileSync("C:/Users/niklo/Downloads/stores.geojson"));


for (let i = 0; i < geojson.features.length; i++) {
  const { id,geometry, properties:{name, shop}  } = geojson.features[i];
  pool.query(
    'INSERT INTO store (osm_id, name, shop, location) VALUES ($1, $2, $3, ST_GeomFromGeoJSON($4))',
    [id, name, shop, geometry],
    (error, results) => {
      if (error) {
        throw error;
      }
      console.log(`Inserted feature ${i}`);
    }
  );
}


module.exports = pool;
