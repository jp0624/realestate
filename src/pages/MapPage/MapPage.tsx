import { useContext } from "react"
import { SiteContext } from "../../context/SiteContext"
import styles from "./styles.module.scss"
import GoogleMap from "google-map-react"
import Marker from "../../components/widgets/Marker/MapMarker"

const MapPage = () => {
	const { searchValue, setSearchValue } = useContext(SiteContext)
	const defaultProps = {
		center: {
			lat: 43.6766941179502,
			lng: -79.40967515041424,
		},
		zoom: 11,
		options: {
			panControl: false,
			mapTypeControl: false,
			scrollwheel: true,
			styles: [
				{
					stylers: [
						{ saturation: -100 },
						{ gamma: 0.8 },
						{ lightness: 4 },
						{ visibility: "on" },
					],
				},
			],
		},
		_onClick: ({ x, y, lat, lng, event }: any) =>
			console.log(x, y, lat, lng, event),
	}
	const locations = [
		{ id: "123 main st", lat: 43.64134360340362, lng: -79.39167602461177 },
		{ id: "234 main st", lat: 43.66314146548834, lng: -79.36395271547869 },
	]
	return (
		<>
			<div className={`${styles.map__container}`}>
				<GoogleMap
					bootstrapURLKeys={{
						key: "",
						language: "en",
					}}
					options={defaultProps.options}
					defaultCenter={defaultProps.center}
					defaultZoom={defaultProps.zoom}
					onClick={defaultProps._onClick}
					yesIWantToUseGoogleMapApiInternals
				>
					{locations.map((location) => (
						<Marker
							key={location.id}
							text={location.id}
							lat={location.lat}
							lng={location.lng}
						/>
					))}
				</GoogleMap>
			</div>
		</>
	)
}

export default MapPage
