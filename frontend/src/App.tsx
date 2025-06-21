import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { Login } from "./pages/Login";
import Listings from "./pages/Listings";
import { Signup } from "./pages/Signup";
import PropertyDetail from "./pages/PropertyDetail";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Signup />} />
					<Route path="/" element={<Listings />} />
					<Route path="/listings/:id" element={<PropertyDetail />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
