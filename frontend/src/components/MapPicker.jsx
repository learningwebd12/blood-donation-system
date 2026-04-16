import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Helper to handle smooth map movement
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      // flyTo gives a smooth "flying" animation to the new location
      map.flyTo(center, 13, { animate: true, duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

export default function MapPicker({ center, onSelect }) {
  function LocationMarker() {
    useMapEvents({
      click(e) {
        // Send clicked coordinates back to CreateBloodRequest
        onSelect(e.latlng);
      },
    });

    // Determine marker position (handles both [lat, lon] and {lat, lon})
    const markerPos = Array.isArray(center)
      ? center
      : center?.lat
        ? [center.lat, center.lon || center.lng]
        : null;
    return markerPos ? <Marker position={markerPos} /> : null;
  }

  return (
    <MapContainer
      center={Array.isArray(center) ? center : [27.7172, 85.324]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <ChangeView center={center} />
      <LocationMarker />
    </MapContainer>
  );
}

// Marker Icon Fix (Required for Leaflet markers to show up)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});
