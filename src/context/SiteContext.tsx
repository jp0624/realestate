import { createContext, useState, ReactNode } from "react"

interface SearchInterface {
	value: string
}

interface SelectedLocationInterface {
	id: string
}

interface CoordsInterface {
	lat: number
	lng: number
}

interface BoundsInterface {
	ne: CoordsInterface
	sw: CoordsInterface
}

// Props for the SiteContext
type SiteContextProps = {
	mapBounds: BoundsInterface
	searchValue: SearchInterface
	selectedLocation: SelectedLocationInterface
	setMapBounds: (mapBounds: BoundsInterface) => void
	setSearchValue: (value: string) => void
	setSelectedLocation: (selectedLocation: SelectedLocationInterface) => void
}

// Create the SiteContext and provide initial values
export const SiteContext = createContext<SiteContextProps>({
	mapBounds: { ne: { lat: 0, lng: 0 }, sw: { lat: 0, lng: 0 } },
	searchValue: { value: "" },
	selectedLocation: { id: "" },
	setMapBounds: () => {},
	setSearchValue: () => {},
	setSelectedLocation: () => {},
})

// Props for the SiteProvider component
type SiteProviderProps = {
	children: ReactNode
}

// SiteProvider component that wraps the children components with the SiteContext
export const SiteProvider = ({ ...children }: SiteProviderProps) => {
	// Define state variables and their setters using useState hook
	const [searchValue, setSearchValue] = useState<any>([])
	const [mapBounds, setMapBounds] = useState<any>([])
	const [selectedLocation, setSelectedLocation] = useState<any>([])
	return (
		<SiteContext.Provider
			value={{
				mapBounds,
				searchValue,
				selectedLocation,
				setMapBounds,
				setSearchValue,
				setSelectedLocation,
			}}
			{...children}
		></SiteContext.Provider>
	)
}
