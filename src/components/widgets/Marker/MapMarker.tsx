import styles from "./styles.module.scss"
import { Marker } from "@react-google-maps/api"
import { useContext } from "react"
import { SiteContext } from "../../../context/SiteContext"

/**
 * MapMarker component displays a marker on the map.
 * @param location - The location data.
 * @param text - The text to display on the marker.
 * @param coords - The coordinates of the marker.
 * @returns The MapMarker component.
 */
const MapMarker = ({
	location,
	text,
	coords,
}: {
	location: any
	text: string
	coords: { lat: number; lng: number }
}) => {
	// Access the site context values and functions
	const { selectedLocation, setSelectedLocation } = useContext(SiteContext)

	/**
	 * Handler for marker click event.
	 * Sets the selected location in the site context.
	 */
	const onMarkerClick = () => {
		setSelectedLocation(location.id)
	}

	return (
		<Marker
			onClick={onMarkerClick}
			key={text}
			position={coords}
			label={{
				text: text,
				className: `${styles.mapMarker} ${
					location.id === selectedLocation ? styles.active : ""
				}`,
			}}
		/>
	)
}

export default MapMarker
