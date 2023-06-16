import LocationCard from "../../cards/LocationCard/LocationCard"
import styles from "./styles.module.scss"

/**
 * MapLocationList component displays a list of locations on the map.
 * @param locations - The array of locations to be displayed.
 * @returns The MapLocationList component.
 */
const MapLocationList = ({ locations }: { locations: any[] }) => {
	return (
		<>
			<ul className={`customScroll ${styles.locations__list}`}>
				{locations.map((location: any, index: number) => (
					<LocationCard key={index} location={location} />
				))}
			</ul>
		</>
	)
}

export default MapLocationList
