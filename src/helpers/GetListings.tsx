import { createContext, useContext, useEffect, useState } from "react"
import { collection, query, orderBy, where } from "firebase/firestore"
import { useFirestore, useFirestoreCollectionData } from "reactfire"

const LocationsContext = createContext([])

export function useLocationsContext() {
	return useContext(LocationsContext)
}

export function LocationsProvider({ children }) {
	const firestore = useFirestore()
	const LocationsCollection = collection(firestore, "locations")
	const locationsQuery = query(LocationsCollection, orderBy("address", "asc"))
	const { status, data: locations } = useFirestoreCollectionData(
		locationsQuery,
		{
			idField: "id",
		}
	)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		if (status === "success") {
			setIsLoading(false)
		}
	}, [status])

	const getListingById = (id) => {
		return locations.find((listing) => listing.id === id) || null
	}

	if (isLoading) {
		return <span>Loading...</span>
	}

	return (
		<LocationsContext.Provider value={{ locations, getListingById }}>
			{children}
		</LocationsContext.Provider>
	)
}
