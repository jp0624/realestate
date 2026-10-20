import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import { Link } from "react-router-dom";
import { type Property, priceLabel } from "./data";
import "leaflet/dist/leaflet.css";
type Bounds = { south: number; north: number; west: number; east: number };
function BoundsReporter({ onChange }: { onChange: (bounds: Bounds) => void }) {
  const map = useMapEvents({ moveend: () => report(), resize: () => report() });
  function report() {
    const b = map.getBounds();
    onChange({
      south: b.getSouth(),
      north: b.getNorth(),
      west: b.getWest(),
      east: b.getEast(),
    });
  }
  useEffect(() => {
    report();
    const resize = new ResizeObserver(() => map.invalidateSize());
    resize.observe(map.getContainer());
    return () => resize.disconnect();
  }, [map]);
  return null;
}
function FitHomes({ homes, reset }: { homes: Property[]; reset: number }) {
  const map = useMap();
  useEffect(() => {
    if (homes.length)
      map.fitBounds(
        L.latLngBounds(homes.map((p) => [p.coords.lat, p.coords.lng])),
        { padding: [40, 40], maxZoom: 13, animate: false },
      );
  }, [homes.map((p) => p.id).join(","), reset, map]);
  return null;
}
function HomeMarkers({ homes }: { homes: Property[] }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });
  if (zoom < 12) {
    const groups = Array.from(new Set(homes.map((p) => p.neighbourhood)));
    return (
      <>
        {groups.map((area) => {
          const rows = homes.filter((p) => p.neighbourhood === area);
          const lat = rows.reduce((n, p) => n + p.coords.lat, 0) / rows.length;
          const lng = rows.reduce((n, p) => n + p.coords.lng, 0) / rows.length;
          return (
            <Marker
              key={area}
              position={[lat, lng]}
              title={`${rows.length} sample homes in ${area}. Zoom in to explore.`}
              eventHandlers={{
                click: () =>
                  map.fitBounds(
                    L.latLngBounds(
                      rows.map((p) => [p.coords.lat, p.coords.lng]),
                    ),
                    { padding: [60, 60], maxZoom: 14 },
                  ),
              }}
              icon={L.divIcon({
                className: "area-marker",
                html: `<span>${rows.length}</span>`,
                iconSize: [40, 40],
                iconAnchor: [20, 20],
              })}
            />
          );
        })}
      </>
    );
  }
  return (
    <>
      {homes.map((p) => (
        <Marker
          key={p.id}
          position={[p.coords.lat, p.coords.lng]}
          icon={L.divIcon({
            className: "price-marker",
            html: `<span>${p.status === "For lease" ? `$${(p.price / 1000).toFixed(1)}k` : `$${(p.price / 1000000).toFixed(2)}m`}</span>`,
            iconSize: [76, 30],
            iconAnchor: [38, 15],
          })}
          title={`${p.address}, ${priceLabel(p)}`}
        >
          <Popup>
            <img
              className="map-popup-photo"
              src={p.images[0]}
              alt={`AI-generated exterior of ${p.address}`}
            />
            <strong>{priceLabel(p)}</strong>
            <p>
              {p.address}
              <br />
              {p.neighbourhood}
            </p>
            <Link to={`/property/${p.id}`}>View home details →</Link>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
export default function PropertyMap({
  properties,
  onBoundsChange,
}: {
  properties: Property[];
  onBoundsChange: (bounds: Bounds) => void;
}) {
  const [failed, setFailed] = useState(false);
  const [reset, setReset] = useState(0);
  return (
    <div className="property-map">
      <button
        className="map-reset"
        onClick={() => {
          setReset((n) => n + 1);
          setFailed(false);
        }}
      >
        Fit all matching homes
      </button>
      <MapContainer
        center={[43.69, -79.4]}
        zoom={10}
        scrollWheelZoom={false}
        aria-label="Map of sample property locations"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{ tileerror: () => setFailed(true) }}
        />
        <FitHomes homes={properties} reset={reset} />
        <BoundsReporter onChange={onBoundsChange} />
        <HomeMarkers homes={properties} />
      </MapContainer>
      <p className="map-hint">
        Select an area count or zoom in to see home prices.
      </p>
      {failed && (
        <p className="map-error" role="status">
          Map tiles couldn’t load. Property pins and the home list remain
          available. Check your connection, or use Grid view.
        </p>
      )}
    </div>
  );
}
