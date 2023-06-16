import { useContext, useEffect } from "react"
import styles from "./styles.module.scss"
import { NavLink } from "react-router-dom"
import { SiteContext } from "../../../context/SiteContext"

interface Location {
	id: string
	coords: {
		lat: number
		lng: number
	}
	address: string
}

interface LocationCardProps {
	location: Location
}

const LocationCard = ({ location }: LocationCardProps): JSX.Element => {
	const { selectedLocation, setSelectedLocation } =
		useContext<any>(SiteContext)

	/**
	 * Sets the selected location when the card is clicked.
	 */
	const setActiveLocation = (): void => {
		setSelectedLocation(location.id)
	}

	useEffect(() => {
		if (location.id === selectedLocation) {
			setSelectedLocation(location.id)
		}
	}, [selectedLocation, location.id])

	return (
		<>
			<li
				className={`${styles.location__card} ${
					location.id === selectedLocation ? styles.active : ""
				}`}
				onClick={setActiveLocation}
			>
				<div className={`${styles.location__card__details}`}>
					<figure>
						<img
							src='/assets/img/icons/icon-images.png'
							alt='Location Icon'
						/>
					</figure>
					<figcaption>
						<ul>
							<li>
								{location.id} - {location.address}
							</li>
						</ul>
					</figcaption>
				</div>
				<nav className={`${styles.location__card__nav}`}>
					<NavLink
						to={`/location/${location.id}`}
						className={`${styles.logo__main}`}
					>
						<button
							className={`${
								styles.location__card__nav__button
							}  ${
								location.id === selectedLocation &&
								styles.active
							}`}
						>
							View Listing
						</button>
					</NavLink>
				</nav>
			</li>
		</>
	)
}

export default LocationCard
