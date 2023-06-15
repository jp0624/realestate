import { useContext } from "react"
import { SiteContext } from "../../context/SiteContext"
import styles from "./styles.module.scss"
import {
	GoogleMap,
	LoadScript,
	useLoadScript,
	MarkerF,
	useJsApiLoader,
} from "@react-google-maps/api"
import MapMarker from "../../components/widgets/Marker/MapMarker"
import { Routes, Route, useParams, useSearchParams } from "react-router-dom"
import MapLocationList from "../../components/panels/MapLocationList/MapLocationList"

const MapPage = () => {
	const { searchValue, setSearchValue } = useContext(SiteContext)
	const [searchParams, setSearchParams] = useSearchParams()
	let searchLatLng = {
		lat: +searchParams.get("lat")! || 43.64134360340362,
		lng: +searchParams.get("lng")! || -79.39167602461177,
	}

	const { isLoaded } = useLoadScript({
		id: "google-map-script",
		googleMapsApiKey: "AIzaSyCGqpSmMYvHjvEe97P4ecrw_Z2KzrM55Sc",
	})

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
	const locations = [
		{
			address: "123 main st",
			coords: { lat: 43.64134360340362, lng: -79.39167602461177 },
		},
		{
			address: "234 main st",
			coords: { lat: 43.66314146548834, lng: -79.36395271547869 },
		},
		{
			address: "23456 Blah Ave",
			coords: { lat: 43.85917013188701, lng: -79.71591901105445 },
		},
		{
			address: "934 test st",
			coords: { lat: 43.57430421351184, lng: -79.74063824644244 },
		},
		{
			address: "200 Another St",
			coords: { lat: 43.87402135204113, lng: -79.1556163422598 },
		},
		{
			address: "110 Charles Est St",
			coords: { lat: 43.64291479171653, lng: -79.5154185462407 },
		},
		{
			address: "55 Broadview Dr",
			coords: { lat: 43.68563252315617, lng: -79.61841536035735 },
		},
		{
			address: "9 Temp Blvd",
			coords: { lat: 43.690597728409564, lng: -79.29981188202315 },
		},
		{
			address: "44 Mapleleafs Rd",
			coords: { lat: 43.620053294961146, lng: -79.3918223693007 },
		},
	]
	return (
		isLoaded && (
			<>
				<GoogleMap
					mapContainerClassName={`${styles.map__container}`}
					center={defaultProps.center}
					zoom={defaultProps.zoom}
					options={defaultProps.options}
				>
					{locations.map((location, index) => (
						<MapMarker
							key={index}
							text={location.address}
							coords={location.coords}
						/>
					))}
					<MapLocationList locations={locations} />
				</GoogleMap>
			</>
		)
	)
}

export default MapPage
