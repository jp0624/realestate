import { Route, Routes, useLocation } from "react-router-dom"
import "./App.scss"
import {
	// doc,
	// query,
	// collection,
	// orderBy,
	getFirestore,
} from "firebase/firestore"
import {
	FirestoreProvider,
	// useFirestoreCollectionData,
	// useFirestoreDocData,
	// useFirestore,
	useFirebaseApp,
} from "reactfire"
import HomePage from "./pages/HomePage/HomePage"
import MapPage from "./pages/MapPage/MapPage"
import LocationPage from "./pages/LocationPage/LocationPage"
import ListingsPage from "./pages/ListingsPage/ListingsPage"
import Header from "./components/structure/Header/Header"
import Footer from "./components/structure/Footer/Footer"
import Body from "./components/structure/Body/Body"

// let LocationsList: any = []

// function Locations() {
// 	const firestore = useFirestore()
// 	const LocationsCollection = collection(firestore, "locations")
// 	const locationsQuery = query(LocationsCollection, orderBy("address", "asc"))

// 	const { status, data: locations } = useFirestoreCollectionData(
// 		locationsQuery,
// 		{
// 			idField: "id",
// 		}
// 	)

// 	if (status === "loading") {
// 		return <span>loading...</span>
// 	}

// 	console.log("data: ", locations)
// 	LocationsList = locations

// 	return (
// 		<ul>
// 			{LocationsList.map((location: any) => (
// 				<li key={location.id}>{location.address}</li>
// 			))}
// 		</ul>
// 	)
// }

function App() {
	let locationPath = useLocation().pathname.replace("/", "")
	if (!locationPath) {
		locationPath = "home"
	}
	console.log("path: " + locationPath)
	const firestoreInstance = getFirestore(useFirebaseApp())
	return (
		<FirestoreProvider sdk={firestoreInstance}>
			<Header page={locationPath} />
			{/* <Locations /> */}
			<Body page={locationPath}>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/map' element={<MapPage />} />
					<Route path='/listings' element={<ListingsPage />} />
					<Route path='/location' element={<LocationPage />} />
					<Route path='/location/:id' element={<LocationPage />} />
				</Routes>
			</Body>
			<Footer page={locationPath} />
		</FirestoreProvider>
	)
}

export default App
