import { useEffect } from "react";
import { useAuthStore } from "../store";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
	const initializeAuth = useAuthStore((state) => state.initializeAuth);
	useEffect(() => {
		initializeAuth();
	}, [initializeAuth]);
    
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
						</div>
					</div>
				</nav>
			</header>
			<main>{children}</main>
		</div>
	);
};

export default AuthLayout;
