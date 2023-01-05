import React, { Fragment, useState, useEffect } from "react";
import icon from "./constants";
import { useMap, Popup, Marker } from "react-leaflet";

const AllStores = () => {
  const [stores, setStores] = useState([]);

  const getAllStores = async () => {
    try {
      const response = await fetch("http://localhost:5000/store");
      const getAllStrs = await response.json();

      setStores(getAllStrs);
      
    } catch (err) {
      console.error(err.message);
    }
  };

  //useEffect//
  useEffect(() => {
    getAllStores();
  }, []);


  console.log(stores);  
  return (
    <Fragment>
      {stores.map((store) => (
        <Marker key={store.store_id} position={[parseFloat(store.store_lat), parseFloat(store.store_lon)]} icon={icon}/>
      ))}
    </Fragment>
  );
};

export default AllStores;
