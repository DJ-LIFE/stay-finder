import { create } from "zustand";

interface AuthState {
	role: "host" | "guest";
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;

	login: (role: "host" | "guest", token: string) => void;
	signup: (role: "host" | "guest", token: string) => void;
	logout: () => void;
	setLoading: (loading: boolean) => void;
	initializeAuth: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
	role: "guest", // Default role
	token: null,
	isAuthenticated: false,
	isLoading: false,

	login: (role: "host" | "guest", token: string) => {
		localStorage.setItem("token", token);
		localStorage.setItem("role", role);
		set({ role, token, isAuthenticated: true });
	},

	signup: (role: "host" | "guest", token: string) => {
		localStorage.setItem("token", token);
		localStorage.setItem("role", role);
		set({ role, token, isAuthenticated: true });
	},

	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("role");
		set({
			role: "guest",
			token: null,
			isAuthenticated: false,
		});
	},

	setLoading: (isLoading: boolean) => {
		set({ isLoading });
	},

	initializeAuth: () => {
		set({ isLoading: true });
		const token = localStorage.getItem("token");
		const role = localStorage.getItem("role") as "host" | "guest" | null;
		if (token && role) {
			set({ role, token, isAuthenticated: true, isLoading: false });
		} else {
			set({
				role: "guest",
				token: null,
				isAuthenticated: false,
				isLoading: false,
			});
		}
	},
}));
