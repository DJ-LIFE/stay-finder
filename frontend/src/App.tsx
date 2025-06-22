import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { Login } from "./pages/Login";
import Listings from "./pages/Listings";
import { Signup } from "./pages/Signup";
import PropertyDetail from "./pages/PropertyDetail";
import AuthLayout from "./layout/AuthLayout";
import CreateListings from "./pages/CreateListings";

function App() {
	return (
		<>
			<BrowserRouter>
				<AuthLayout>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/register" element={<Signup />} />
						<Route path="/" element={<Listings />} />
						<Route
							path="/listings/:id"
							element={<PropertyDetail />}
						/>
						<Route
							path="/host/create"
							element={<CreateListings />}
						/>
					</Routes>
				</AuthLayout>
			</BrowserRouter>
		</>
	);
}

export default App;
