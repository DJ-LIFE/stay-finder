import { useEffect } from "react";
import { useAuthStore } from "../store";
import { useNavigate } from "react-router";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	// const { isAuthenticated, user, logout } = useAuthStore((state) => ({
	// 	isAuthenticated: state.isAuthenticated,
	// 	user: state.user,
	// 	logout: state.logout,
	// }));
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const user = useAuthStore((state) => state.user);
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const logout = useAuthStore((state) => state.logout);
	const role = user?.role;
	const navigate = useNavigate();

	useEffect(() => {
		initializeAuth();
	}, []);

	const logoutHandler = () => {
		logout();
		navigate("/login");
	};

	return (
		<div>
			<header className="bg-indigo-600">
				<nav className="container mx-auto px-4 py-4">
					<div className="flex items-center justify-between">
						<a
							href="/"
							className="text-white text-lg font-semibold"
						>
							Stay Finder
						</a>
						<div className="space-x-4">
							{isAuthenticated ? (
								<>
									<span className="text-white">
										Welcome, {user?.name}
									</span>
									{role === "host" && (
										<a
											href="/host/create"
											className="text-white hover:text-indigo-200"
										>
											Create Listings
										</a>
									)}
									<button
										onClick={logoutHandler}
										className="text-white hover:text-indigo-200"
									>
										Logout
									</button>
								</>
							) : (
								<>
									<a
										href="/login"
										className="text-white hover:text-indigo-200"
									>
										Login
									</a>
									<a
										href="/register"
										className="text-white hover:text-indigo-200"
									>
										Register
									</a>
								</>
							)}
						</div>
					</div>
				</nav>
			</header>
			<main>{children}</main>
		</div>
	);
};

export default AuthLayout;
