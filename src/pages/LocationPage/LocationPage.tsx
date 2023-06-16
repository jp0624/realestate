import { useParams } from "react-router-dom"
import styles from "./styles.module.scss"
import { useLocationsContext } from "../../helpers/GetLocations"
import CommentsPanel from "../../components/panels/CommentsPanel/CommentsPanel"
import { CommentsLocationsProvider } from "../../helpers/GetComments"

/**
 * Renders the location page component.
 */
const LocationPage = () => {
	// Get the id parameter from the URL
	const { id = "" } = useParams()

	// Access the getListingById function from the locations context
	const { getListingById } = useLocationsContext()

	// Get the location object by id
	const location = getListingById(id)

	// If the location is not found, render a message
	if (!location) {
		return <span>Listing not found</span>
	}

	// Log the location object
	console.log("location: ", location)

	return (
		<>
			<div className={`${styles.location__page__container}`}>
				<h1 className={`${styles.location__page__heading}`}>
					{location.address}
				</h1>
				<h2 className={`${styles.location__page__subheading}`}>
					{location.city}, {location.prov}
				</h2>
				<h3 className={`${styles.location__page__cost}`}>
					{location.cost}
				</h3>
				<div className={`${styles.location__page__images}`}>
					<figure>
						<img src='/assets/img/icons/icon-images.png' />
					</figure>
					<figure>
						<img src='/assets/img/icons/icon-images.png' />
					</figure>
					<figure>
						<img src='/assets/img/icons/icon-images.png' />
					</figure>
					<figure>
						<img src='/assets/img/icons/icon-images.png' />
					</figure>
					<figure>
						<img src='/assets/img/icons/icon-images.png' />
					</figure>
				</div>
				<h2 className={`${styles.location__page__heading}`}>
					Listing Description
				</h2>
				<ul className={`${styles.location__page__details}`}>
					<li>{location.description}</li>
				</ul>
			</div>
			<div className={`${styles.location__page__comments}`}>
				<CommentsLocationsProvider>
					{/* Render the comments panel */}
					<CommentsPanel id={id} />
				</CommentsLocationsProvider>
			</div>
		</>
	)
}

export default LocationPage
