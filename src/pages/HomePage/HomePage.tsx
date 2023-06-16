import SearchPanel from "./../../components/panels/SearchPanel/SearchPanel"

/**
 * Renders the home page component.
 */
const HomePage = () => {
	return (
		<>
			{/* Render the search panel for the home page */}
			<SearchPanel pageType={"homePage"} />
		</>
	)
}

export default HomePage
