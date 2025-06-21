import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import { Login } from "./pages/Login";
import Listings from "./pages/Listings";
import { Signup } from "./pages/Signup";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Signup />} />
					<Route path="/" element={<Listings />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
