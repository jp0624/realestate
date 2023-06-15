import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"

import { SiteContext } from "../../../context/SiteContext"
import styles from "./styles.module.scss"

const SearchPanel = () => {
	const { searchValue, setSearchValue } = useContext(SiteContext)
	const [inputValue, setInput] = useState("")
	const navigate = useNavigate()

	if ("geolocation" in navigator) {
		console.log("Available")
		navigator.geolocation.getCurrentPosition(function (position) {
			console.log("Latitude is :", position.coords.latitude)
			console.log("Longitude is :", position.coords.longitude)
		})
		navigator.geolocation.getCurrentPosition(function (position) {
			console.log(position)
		})
	} else {
		console.log("Not Available")
	}

	const inputUpdate = (event: any) => {
		setInput(event.target.value)
	}
	const clearInput = () => {
		setInput("")
	}
	const submitSearch = (event: any) => {
		event.preventDefault()
		// let termsArr: string[] = inputValue.split(",")
		// let cleanTerms: string[] = []
		// termsArr.forEach((term: any) => {
		// 	cleanTerms.push(term.toLowerCase().trim().split(" "))
		// })
		setSearchValue(inputValue)
		navigate(`/map?search=${inputValue}`)
	}
	let initValue = ""
	!!searchValue && (initValue = searchValue)

	return (
		<>
			<form
				onSubmit={submitSearch}
				className={`${styles.searchPanel__container}`}
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
						placeholder='Toronto, ON'
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
