import { createContext, useState, ReactNode } from "react"

interface SearchInterface {
	value: string
}

// Props for the SiteContext
type SiteContextProps = {
	searchValue: string
	setSearchValue: (value: string) => void
}

// Create the SiteContext and provide initial values
export const SiteContext = createContext<SiteContextProps>({
	searchValue: "",
	setSearchValue: () => {},
})

// Props for the SiteProvider component
type SiteProviderProps = {
	children: ReactNode
}

// SiteProvider component that wraps the children components with the SiteContext
export const SiteProvider = ({ ...children }: SiteProviderProps) => {
	// Define state variables and their setters using useState hook
	const [searchValue, setSearchValue] = useState("")
	return (
		<SiteContext.Provider
			value={{
				searchValue,
				setSearchValue,
			}}
			{...children}
		></SiteContext.Provider>
	)
}
