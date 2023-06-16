import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Geocode from "react-geocode"
import { SiteContext } from "../../../context/SiteContext"
import styles from "./styles.module.scss"

/**
 * SearchPanel component represents the search panel for finding locations.
 * @param pageType - The type of page where the SearchPanel is rendered.
 * @returns The SearchPanel component.
 */
const SearchPanel = ({ pageType }: { pageType: string }): JSX.Element => {
	const { searchValue, setSearchValue, setSelectedLocation } =
		useContext(SiteContext)
	const [inputValue, setInput] = useState("")
	const navigate = useNavigate()

	// Configure Geocode library
	Geocode.setApiKey(import.meta.env.VITE_GOOGLE_MAPS_API_KEY)
	Geocode.setLanguage("en")
	Geocode.setLocationType("ROOFTOP")
	Geocode.enableDebug()

	/**
	 * Handle input value update.
	 * @param event - The input change event.
	 */
	const inputUpdate = (event: React.ChangeEvent<HTMLInputElement>): void => {
		setInput(event.target.value)
	}

	/**
	 * Clear the input value.
	 */
	const clearInput = (): void => {
		setInput("")
	}

	/**
	 * Submit the search form.
	 * @param event - The form submit event.
	 */
	const submitSearch = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault()
		setSearchValue(inputValue)
		setSelectedLocation({ id: "" }) // Pass an empty SelectedLocationInterface object

		// Use Geocode library to fetch coordinates for the entered address
		Geocode.fromAddress(inputValue).then(
			(response: any) => {
				const { lat, lng } = response.results[0].geometry.location
				console.log("LAT AND LNG: ", lat + " " + lng)

				navigate(`/map?lat=${lat}&lng=${lng}`)
			},
			(error: any) => {
				// Use default coordinates if the address lookup fails
				const lat = 43.64134360340362
				const lng = -79.39167602461177
				navigate(`/map?lat=${lat}&lng=${lng}`)
				console.error(error)
			}
		)
	}

	let initValue: any = ""
	if (!!searchValue) {
		initValue = searchValue
	}

	let containerStyle = ""
	if (!!pageType && pageType === "homePage") {
		containerStyle = styles.searchPanel__container__home
	} else if (!!pageType && pageType === "mapPage") {
		containerStyle = styles.searchPanel__container__map
	}

	return (
		<>
			<form
				onSubmit={submitSearch}
				className={`${styles.searchPanel__container} ${containerStyle}`}
			>
				<h2>Find your new home..</h2>
				<div className={`${styles.searchPanel__form}`}>
					<button
						type='button'
						className={`${styles.searchPanel__form__clear} ${
							!!inputValue ? styles.visible : styles.hidden
						}`}
						onClick={clearInput}
					></button>
					<input
						type='text'
						placeholder='ex: Toronto, ON'
						className={`${styles.searchPanel__form__input}`}
						value={inputValue}
						onChange={inputUpdate}
					/>
					<button
						type='submit'
						className={`${styles.searchPanel__form__search}`}
					>
						Search
					</button>
				</div>
			</form>
		</>
	)
}

export default SearchPanel
