import { useContext } from "react"
import { SiteContext } from "../../context/SiteContext"
import styles from "./styles.module.scss"
import GoogleMap from "google-map-react"
import Marker from "../../components/widgets/Marker/MapMarker"
import { Routes, Route, useParams, useSearchParams } from "react-router-dom"

const MapPage = () => {
	const { searchValue, setSearchValue } = useContext(SiteContext)
	const [searchParams, setSearchParams] = useSearchParams()
	let searchLatLng = {
		lat: +searchParams.get("lat")! || 43.64134360340362,
		lng: +searchParams.get("lng")! || -79.39167602461177,
	}
	console.log("searchParams LAT: ", searchParams.get("lat"))
	console.log("searchParams LNG: ", searchParams.get("lng"))
	console.log("searchLatLng.lat: ", searchLatLng.lat)
	console.log("searchLatLng.lng: ", searchLatLng.lng)
	const defaultProps = {
		center: {
			lat: searchLatLng.lat,
			lng: searchLatLng.lng,
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
	console.log("defaultProps:", defaultProps)
	const locations = [
		{ id: "123 main st", lat: 43.64134360340362, lng: -79.39167602461177 },
		{ id: "234 main st", lat: 43.66314146548834, lng: -79.36395271547869 },
	]
	return (
		<>
			<div className={`${styles.map__container}`}>
				<GoogleMap
					bootstrapURLKeys={{
						key: "AIzaSyCGqpSmMYvHjvEe97P4ecrw_Z2KzrM55Sc",
						language: "en",
					}}
					options={defaultProps.options}
					defaultCenter={defaultProps.center}
					defaultZoom={defaultProps.zoom}
					onClick={defaultProps._onClick}
					yesIWantToUseGoogleMapApiInternals
				>
					{/* {locations.map((location) => (
						<Marker
							key={location.id}
							text={location.id}
							lat={location.lat}
							lng={location.lng}
						/>
					))} */}
				</GoogleMap>
			</div>
		</>
	)
}

export default MapPage
