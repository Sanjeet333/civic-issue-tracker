import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({ iconUrl: icon, shadowUrl: iconShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

const MapPicker = ({ setLocation, location }) => {
  const LocationMarker = () => {
    useMapEvents({
      click(e) { setLocation({ lat: e.latlng.lat, lng: e.latlng.lng }); },
    });
    return location ? <Marker position={[location.lat, location.lng]} /> : null;
  };

  return (
    <MapContainer center={[28.6139, 77.2090]} zoom={13} style={{ height: "250px", width: "100%", borderRadius: "12px" }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
};
export default MapPicker;