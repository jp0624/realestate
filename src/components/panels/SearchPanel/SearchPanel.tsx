import { useState } from "react"
import styles from "./styles.module.scss"

const SearchPanel = () => {
	const [inputValue, setInput] = useState("")

	const inputUpdate = (event: any) => {
		setInput(event.target.value)
	}
	const clearInput = () => {
		setInput("")
	}
	const submitSearch = (event: any) => {
		event.preventDefault()
		let termsArr: string[] = inputValue.split(",")
		let cleanTerms: string[] = []
		termsArr.forEach((term: any) => {
			cleanTerms.push(term.toLowerCase().trim().split(" "))
		})
	}

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
						value={`${inputValue}`}
						onInput={inputUpdate}
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
