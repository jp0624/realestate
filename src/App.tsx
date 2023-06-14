// import { useState } from "react"
// import reactLogo from "./assets/react.svg"
// import viteLogo from "/vite.svg"
import "./App.css"
import {
	doc,
	query,
	collection,
	orderBy,
	getFirestore,
} from "firebase/firestore"
import {
	FirestoreProvider,
	useFirestoreCollectionData,
	useFirestoreDocData,
	useFirestore,
	useFirebaseApp,
} from "reactfire"

// function Locations() {
// 	// easily access the Firestore library
// 	const condo01 = doc(useFirestore(), "locations", "condo01")

// 	// subscribe to a document for realtime updates. just one line!
// 	const { status, data } = useFirestoreDocData(condo01)

// 	// easily check the loading status
// 	if (status === "loading") {
// 		return <p>Fetching Locations...</p>
// 	}
// 	console.log("data: ", data)
// 	return <p>The address is {data.address ? data.address : "no address"}!</p>
// }
let LocationsList: any = []
function Locations() {
	const firestore = useFirestore()
	const LocationsCollection = collection(firestore, "locations")
	const locationsQuery = query(LocationsCollection, orderBy("address", "asc"))

	const { status, data: locations } = useFirestoreCollectionData(
		locationsQuery,
		{
			idField: "id",
		}
	)

	if (status === "loading") {
		return <span>loading...</span>
	}

	console.log("data: ", locations)
	LocationsList = locations

	return (
		<ul>
			{LocationsList.map((location: any) => (
				<li key={location.id}>{location.address}</li>
			))}
		</ul>
	)
}

function App() {
	const firestoreInstance = getFirestore(useFirebaseApp())
	return (
		<FirestoreProvider sdk={firestoreInstance}>
			<Locations />
		</FirestoreProvider>
	)
}

export default App
