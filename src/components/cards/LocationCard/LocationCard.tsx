import { useContext, useEffect } from "react"
import { SiteContext } from "../../../context/SiteContext"
import styles from "./styles.module.scss"
import { NavLink } from "react-router-dom"

interface locationInterface {
	id: string
	coords: {
		lat: number
		lng: number
	}
	address: string
}
const LocationCard = ({ location }: any) => {
	const { selectedLocation, setSelectedLocation } = useContext(SiteContext)

	const setActiveLocation = () => {
		setSelectedLocation(location.id)
	}

	useEffect(() => {
		if (location.id === selectedLocation) {
			setSelectedLocation(location.id)
		}
	}, [selectedLocation, location.id])
	console.log(location)

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
						<img src='/assets/img/icons/icon-images.png' />
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
