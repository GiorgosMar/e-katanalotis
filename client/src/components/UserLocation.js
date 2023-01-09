import React, {useState, useEffect } from "react"
import L from "leaflet"
import icon from "./constants"
import {useMap, Popup, Marker } from "react-leaflet";



const UserLocation = () => {
    const [position, setPosition] = useState(null);

    const map = useMap();

    useEffect(() => {
      map.locate().on("locationfound", function (e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        //const radius = e.accuracy;
        const radius = 50;
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);
      });
    }, [map]);

    return position === null ? null : (
      <Marker position={position} icon={icon} >
        <Popup>
          You are here.
        </Popup>
      </Marker>
    );
  }

  export default UserLocation;