import styles from "./styles.module.scss"

const SearchPanel = () => {
	return (
		<>
			<div className={`${styles.search__container}`}>
				<h2>Find your new home..</h2>
				<div className={`${styles.input__container}`}>
					<input type='text' placeholder='Toronto, ON' />
					<button type='button'>Search</button>
				</div>
			</div>
		</>
	)
}

export default SearchPanel
