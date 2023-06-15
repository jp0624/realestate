import styles from "./styles.module.scss"
import { MarkerF } from "@react-google-maps/api"
const MapMarker = ({ text, coords }: any) => {
	const onMarkerClick = (event: any) => {
		console.log(coords)
	}
	return (
		<MarkerF
			onClick={onMarkerClick}
			key={text}
			label={text}
			position={coords}
		/>
	)
}

export default MapMarker
