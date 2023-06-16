import { Route, Routes, useLocation } from "react-router-dom"
import { FirestoreProvider, useFirebaseApp } from "reactfire"
import { getFirestore } from "firebase/firestore"
import { SiteProvider } from "./context/SiteContext"
import HomePage from "./pages/HomePage/HomePage"
import MapPage from "./pages/MapPage/MapPage"
import LocationPage from "./pages/LocationPage/LocationPage"
import Header from "./components/structure/Header/Header"
import Footer from "./components/structure/Footer/Footer"
import Body from "./components/structure/Body/Body"
import "./App.scss"
import { LocationsProvider, useLocationsContext } from "./helpers/GetLocations"

function App() {
	let locationPath = useLocation().pathname.replace("/", "")
	if (!locationPath) {
		locationPath = "home"
	}
	const firestoreInstance = getFirestore(useFirebaseApp())

	return (
		<FirestoreProvider sdk={firestoreInstance}>
			<SiteProvider>
				<Header />
				<LocationsProvider>
					<Body page={locationPath}>
						<Routes>
							<Route path='/' element={<HomePage />} />
							<Route path='/map' element={<MapPage />} />
							<Route path='/location' element={<MapPage />} />
							<Route
								path='/location/:id'
								element={<LocationPage />}
							/>
						</Routes>
					</Body>
				</LocationsProvider>
				<Footer />
			</SiteProvider>
		</FirestoreProvider>
	)
}

export default App
