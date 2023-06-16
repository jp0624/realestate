import styles from "./styles.module.scss"
import { Marker } from "@react-google-maps/api"
import { useContext } from "react"
import { SiteContext } from "../../../context/SiteContext"

const MapMarker = ({ location, text, coords }: any) => {
	const {
		mapBounds,
		searchValue,
		selectedLocation,
		setSearchValue,
		setMapBounds,
		setSelectedLocation,
	} = useContext(SiteContext)

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
