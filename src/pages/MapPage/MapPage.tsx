import { useContext, useState, useCallback, useEffect, useMemo } from "react"
import { GoogleMap, useLoadScript } from "@react-google-maps/api"
import { useSearchParams } from "react-router-dom"
import { SiteContext } from "../../context/SiteContext"
import { useLocationsContext } from "../../helpers/GetListings"
import MapLocationList from "../../components/panels/MapLocationList/MapLocationList"
import MapMarker from "../../components/widgets/Marker/MapMarker"
import SearchPanel from "../../components/panels/SearchPanel/SearchPanel"
import styles from "./styles.module.scss"

// Interface for the coordinates
interface CoordinatesInterface {
	lat: number
	lng: number
}

// Interface for the map bounds
interface BoundsInterface {
	ne: CoordinatesInterface
	sw: CoordinatesInterface
}

// Interface for the marker data
interface MarkerDataInterface {
	lat: number
	lng: number
	location: LocationInterface
}

// Interface for a location
interface LocationInterface {
	id: string
	coords: {
		lat: number
		lng: number
	}
	address: string
}

const MapPage = () => {
	// Access the mapBounds and setMapBounds from the SiteContext
	const { mapBounds, setMapBounds } = useContext(SiteContext)

	// Get the search parameters from the URL
	const [searchParams] = useSearchParams()

	// State variables
	const [mapInstance, setMap] = useState<google.maps.Map | null>(null)
	const [panned, setPanned] = useState(false)
	const [zoomed, setZoomed] = useState(false)
	const [centered, setCenter] = useState(false)
	const [mapCenter, setMapCenter] = useState<CoordinatesInterface>({
		lat: +searchParams.get("lat")! || 43.64134360340362,
		lng: +searchParams.get("lng")! || -79.39167602461177,
	})
	const [markers, setMarkers] = useState<MarkerDataInterface[]>([])

	// Callback function to handle map load
	const loadMap = useCallback((map: google.maps.Map) => {
		setMap(map)
	}, [])

	// Get the locations from the context
	const { locations } = useLocationsContext()

	// Load the Google Maps script
	const { isLoaded } = useLoadScript({
		id: "google-map",
		googleMapsApiKey: "AIzaSyCGqpSmMYvHjvEe97P4ecrw_Z2KzrM55Sc",
	})

	// Fetch listings when locations or map instance change
	useEffect(() => {
		if (locations.length > 0 && mapInstance && !mapBounds) {
			handleMapIdle()
		}
	}, [locations, mapInstance, mapBounds])

	// Filter the locations based on the map bounds
	const filterLocations = useCallback(() => {
		if (!mapBounds) {
			return locations
		}

		return locations.filter((location: LocationInterface) => {
			const { lat, lng } = location.coords
			return (
				lat >= (mapBounds.sw?.lat ?? -Infinity) &&
				lat <= (mapBounds.ne?.lat ?? Infinity) &&
				lng >= (mapBounds.sw?.lng ?? -Infinity) &&
				lng <= (mapBounds.ne?.lng ?? Infinity)
			)
		})
	}, [mapBounds, locations])

	// Memoize the filtered locations to prevent unnecessary re-renders
	const filteredLocations = useMemo(
		() => filterLocations(),
		[filterLocations]
	)

	// Update the map center when the search parameters change
	useEffect(() => {
		if (searchParams.get("lat") && searchParams.get("lng")) {
			setMapCenter({
				lat: +searchParams.get("lat")!,
				lng: +searchParams.get("lng")!,
			})
		}
	}, [searchParams])

	// Callback function to handle map idle event
	const handleMapIdle = useCallback(() => {
		if (mapInstance && (panned || zoomed || centered)) {
			const bounds = mapInstance.getBounds()
			if (bounds) {
				const ne = bounds.getNorthEast()
				const sw = bounds.getSouthWest()
				const updatedBounds: BoundsInterface = {
					ne: { lat: ne.lat(), lng: ne.lng() },
					sw: { lat: sw.lat(), lng: sw.lng() },
				}
				if (
					!mapBounds ||
					updatedBounds.ne?.lat !== mapBounds.ne?.lat ||
					updatedBounds.ne.lng !== mapBounds.ne?.lng ||
					updatedBounds.sw?.lat !== mapBounds.sw?.lat ||
					updatedBounds.sw.lng !== mapBounds.sw?.lng
				) {
					console.log("Map Bounds:", updatedBounds)
					setMapBounds(updatedBounds)
					setMapCenter({
						lat: (ne.lat() + sw.lat()) / 2,
						lng: (ne.lng() + sw.lng()) / 2,
					})
				}
			}
			setPanned(false)
			setZoomed(false)
			setCenter(false)
		}
	}, [mapInstance, panned, mapBounds, zoomed, centered, setMapBounds])

	// Callback function to handle zoom change event
	const handleZoomChanged = useCallback(() => {
		setZoomed(true)
	}, [])

	// Callback function to handle drag end event
	const handleDragEnd = useCallback(() => {
		setPanned(true)
	}, [])

	// Callback function to handle center change event
	const handleCenterChanged = useCallback(() => {
		setCenter(true)
	}, [])

	// Add event listener for map tiles loaded and clean up on unmount
	useEffect(() => {
		if (mapInstance && isLoaded) {
			const listener = mapInstance.addListener(
				"tilesloaded",
				handleMapIdle
			)
			return () => {
				google.maps.event.removeListener(listener)
			}
		}
	}, [mapInstance, isLoaded, handleMapIdle])

	// Set markers after a delay to ensure the map is loaded
	useEffect(() => {
		if (isLoaded) {
			const markerTimeout = setTimeout(() => {
				setMarkers(
					locations.map((location: LocationInterface) => ({
						lat: location.coords.lat,
						lng: location.coords.lng,
						location: location,
					}))
				)
			}, 250)

			return () => clearTimeout(markerTimeout)
		}
	}, [isLoaded, locations])

	// Render the map component when it's loaded
	return isLoaded ? (
		<>
			<GoogleMap
				mapContainerClassName={`${styles.map__container}`}
				center={mapCenter}
				zoom={11}
				options={{
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
				}}
				onLoad={loadMap}
				onZoomChanged={handleZoomChanged}
				onDragEnd={handleDragEnd}
				onCenterChanged={handleCenterChanged}
			>
				{/* Render markers */}
				{markers.map((marker, index) => (
					<MapMarker
						key={index}
						text={marker.location.id}
						coords={{ lat: marker.lat, lng: marker.lng }}
						location={marker.location}
					/>
				))}

				{/* Render map location list */}
				{mapBounds && <MapLocationList locations={filteredLocations} />}

				{/* Render search panel */}
				<SearchPanel pageType={"mapPage"} />
			</GoogleMap>
		</>
	) : null
}

export default MapPage
