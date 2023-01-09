import L from "leaflet";
import redMarker from '../images/redMarker.png';
import greenMarker from '../images/greenMarker.png';


export default 

L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

export const redMrkr = new L.icon({
  iconSize: [40, 40],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: redMarker,
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});

export const greenMrkr = new L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: greenMarker,
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png"
});
