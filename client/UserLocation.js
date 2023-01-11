import React, { useState, useEffect } from "react";
import L from "leaflet";
import icon from "./constants";
import { useMap, Popup, Marker } from "react-leaflet";

const UserLocation = (props) => {
  const [position, setPosition] = useState(null);
  
  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      const radius = 500;
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
      const circleBounds = circle.getBounds();
    });
  }, [map]);

  console.log(position);
  return position === null ? null : (
    <Marker position={position} icon={icon}>
      <Popup>You are here.</Popup>
      {props.circleBounds}
    </Marker>
  );
};

export default UserLocation;
