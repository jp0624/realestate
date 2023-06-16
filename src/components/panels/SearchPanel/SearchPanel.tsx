import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import Geocode from "react-geocode"

import { SiteContext } from "../../../context/SiteContext"
import styles from "./styles.module.scss"

////////////////////////////////
////////////////////////////////
////////////////////////////////
// useMemo from react for input default
////////////////////////////////
////////////////////////////////
////////////////////////////////
const SearchPanel = ({ pageType }: any) => {
	const { searchValue, setSearchValue, setSelectedLocation } =
		useContext(SiteContext)
	const [inputValue, setInput] = useState("")
	const navigate = useNavigate()
	Geocode.setApiKey("AIzaSyCGqpSmMYvHjvEe97P4ecrw_Z2KzrM55Sc")
	Geocode.setLanguage("en")
	Geocode.setLocationType("ROOFTOP")
	Geocode.enableDebug()

	const inputUpdate = (event: any) => {
		setInput(event.target.value)
	}
	const clearInput = () => {
		setInput("")
	}
	const submitSearch = (event: any) => {
		event.preventDefault()
		setSearchValue(inputValue)
		setSelectedLocation("")
		Geocode.fromAddress(inputValue).then(
			(response: any) => {
				const { lat, lng } = response.results[0].geometry.location
				console.log("LAT AND LNG: ", lat + " " + lng)

				navigate(`/map?lat=${lat}&lng=${lng}`)
			},
			(error: any) => {
				const lat = 43.64134360340362
				const lng = -79.39167602461177
				navigate(`/map?lat=${lat}&lng=${lng}`)
				console.error(error)
			}
		)
	}
	let initValue = ""
	!!searchValue && (initValue = searchValue)
	let containerStyle
	if (!!pageType && pageType == "homePage") {
		containerStyle = styles.searchPanel__container__home
	} else if (!!pageType && pageType == "mapPage") {
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
						className={`
                            ${styles.searchPanel__form__clear}
                            ${!!inputValue ? styles.visible : styles.hidden}
                            `}
						value={``}
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
						type='button'
						className={`${styles.searchPanel__form__search}`}
						onClick={submitSearch}
					>
						Search
					</button>
				</div>
			</form>
		</>
	)
}

export default SearchPanel
