import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.tsx"
import { FirebaseAppProvider } from "reactfire"
import { BrowserRouter } from "react-router-dom"

const firebaseConfig = {
	apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
	authDomain: "jp0624-realestate.firebaseapp.com",
	databaseURL: "https://jp0624-realestate-default-rtdb.firebaseio.com",
	projectId: "jp0624-realestate",
	storageBucket: "jp0624-realestate.appspot.com",
	messagingSenderId: "582862176535",
	appId: "1:582862176535:web:dff1e6b244a860b6867752",
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<FirebaseAppProvider firebaseConfig={firebaseConfig}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</FirebaseAppProvider>
	</React.StrictMode>
)
