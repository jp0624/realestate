import LocationCard from "../../cards/LocationCard/LocationCard"
import styles from "./styles.module.scss"

const MapLocationList = ({ locations }: any) => {
	return (
		<>
			<ul className={`customScroll ${styles.locations__list}`}>
				{locations.map((location: any, index: any) => (
					<LocationCard
						key={index}
						className={`${styles.locations__list__item}`}
						location={location}
					/>
				))}
			</ul>
		</>
	)
}

export default MapLocationList
