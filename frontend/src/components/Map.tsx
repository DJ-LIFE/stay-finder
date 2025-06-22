import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: markerIcon2x,
	iconUrl: markerIcon,
	shadowUrl: markerShadow,
});

export const Map = ({
	coordinates,
	name,
}: {
	coordinates: { lat: number; lng: number };
	name: string;
}) => {
	if (!coordinates) return null;
	return (
		<div className="h-[300px] max-w-200 container mx-auto w-full mt-4 border border-neutral-300 rounded-md mb-40">
			{" "}
			<MapContainer
				center={[coordinates.lat, coordinates.lng]}
				zoom={13}
				scrollWheelZoom={true}
				dragging={true}
				doubleClickZoom={true}
				style={{ height: "100%", width: "100%" }}
			>
				<TileLayer
					attribution="&copy  OpenStreetMap contributors"
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>
				<Marker position={[coordinates.lat, coordinates.lng]}>
					<Popup>{name}</Popup>
				</Marker>
			</MapContainer>
		</div>
	);
};
