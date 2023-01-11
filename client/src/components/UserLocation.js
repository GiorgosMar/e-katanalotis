import React, {useEffect, useContext } from "react";
import L from "leaflet";
import icon from "./constants";
import { useMap, Popup, Marker } from "react-leaflet";
import { UserPosition } from "./UserContext";

const UserLocation = () => {
  const { position, setPosition } = useContext(UserPosition);


  const map = useMap();

  useEffect(() => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      const radius = 500;
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
    });
  }, [map]);

  
  return position === null ? null : (
    <Marker position={position} icon={icon}>
      <Popup>You are here.</Popup>
    </Marker>
  );
};

export default UserLocation;
