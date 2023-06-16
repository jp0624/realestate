import { createContext, useContext, useEffect, useState } from "react"
import { collection, query, orderBy, DocumentData } from "firebase/firestore"
import { useFirestore, useFirestoreCollectionData } from "reactfire"

// Create a context for locations
const LocationsContext = createContext<{
	locations: DocumentData[]
	getListingById: (id: any) => DocumentData | null
}>({
	locations: [], // Default empty array for locations
	getListingById: () => null, // Default implementation of getListingById returns null
})

// Custom hook to access the locations context
export function useLocationsContext() {
	return useContext(LocationsContext)
}

/**
 * Provider component that wraps the children and provides the locations context.
 * @param children - The child components to be wrapped.
 * @returns The locations context provider component.
 */
export function LocationsProvider({ children }: { children: React.ReactNode }) {
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

	// Set isLoading to false when the data retrieval is successful
	useEffect(() => {
		if (status === "success") {
			setIsLoading(false)
		}
	}, [status])

	/**
	 * Retrieves a listing by its ID.
	 * @param id - The ID of the listing to retrieve.
	 * @returns The listing with the specified ID, or null if not found.
	 */
	const getListingById = (id: any): DocumentData | null => {
		return locations.find((listing) => listing.id === id) || null
	}

	if (isLoading) {
		return <span>Loading...</span>
	}

	// Render the locations context provider with the children
	return (
		<LocationsContext.Provider value={{ locations, getListingById }}>
			{children}
		</LocationsContext.Provider>
	)
}
