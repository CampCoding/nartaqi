"use client";

import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// إصلاح أيقونة Marker في Next/Leaflet
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


function ClickCatcher({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

const MapPicker= ({ center, marker, onPick, zoom = 13 }) => {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={zoom}
      scrollWheelZoom={true}
      className="w-full h-full"
      style={{ minHeight: 320 }}
    >
      <TileLayer
        // خرائط OSM المجانية
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      />
      <ClickCatcher onPick={onPick} />
      {marker && <Marker position={[marker.lat, marker.lng]} />}
    </MapContainer>
  );
};

export default MapPicker;
