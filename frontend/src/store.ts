import { create } from "zustand";
// "user": {
//         "id": "6855d654bdfb2203fac977d4",
//         "email": "john@gmail.com",
//         "role": "host",
//         "name": "John Desuza"
//     }
interface User {
	id: string;
	email: string;
	role: "host" | "guest";
	name: string;
}
interface AuthState {
	role: "host" | "guest";
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	user?: User; // Optional user object to store user details

	login: (role: "host" | "guest", token: string, user: User) => void;
	signup: (role: "host" | "guest", token: string, user: User) => void;
	logout: () => void;
	setLoading: (loading: boolean) => void;
	initializeAuth: () => void;
}
export const useAuthStore = create<AuthState>((set) => ({
	role: "guest", // Default role
	token: null,
	isAuthenticated: false,
	isLoading: false,

	login: (role: "host" | "guest", token: string, user: User) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		set({ role, token, isAuthenticated: true, user });
	},

	signup: (role: "host" | "guest", token: string, user: User) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(user));
		set({ role, token, isAuthenticated: true, user });
	},

	logout: () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		set({
			role: "guest",
			token: null,
			isAuthenticated: false,
			user: undefined,
		});
	},

	setLoading: (isLoading: boolean) => {
		set({ isLoading });
	},

	initializeAuth: () => {
		const currentState = useAuthStore.getState();

		if(currentState.isAuthenticated) {
			return;
		}
		set({ isLoading: true });
		const token = localStorage.getItem("token");
		const user = localStorage.getItem("user")
			? JSON.parse(localStorage.getItem("user")!)
			: null;
		if (token && user) {
			set({
				token,
				isAuthenticated: true,
				isLoading: false,
				user,
				role: user.role, 
			});
		} else {
			set({
				role: "guest",
				token: null,
				isAuthenticated: false,
				isLoading: false,
				user: undefined,
			});
		}
	},
}));
