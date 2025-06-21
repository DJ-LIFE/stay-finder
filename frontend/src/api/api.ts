import axios from "axios";
const API_BASE_URL =
	import.meta.env.API_BASE_URL || "http://localhost:8081/api";

const api = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json",
	},
});

api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const userApi = {
	login: async (email: string, password: string) => {
		const res = await api.post("/login", { email, password });
		return res.data;
	},
	register: async (
		email: string,
		password: string,
		name: string,
		role: string
	) => {
		const res = await api.post("/register", {
			email,
			password,
			name,
			role,
		});
		return res.data;
	},
	getProfile: async () => {
		const res = await api.get("/profile");
		return res.data;
	}
};

export const listingApi = {
	getListings: async () => {
		const res = await api.get("/listings");
		return res.data;
	},
	getListingById: async (id: string) => {
		const res = await api.get(`/listings/${id}`);
		return res.data;
	},
};

export const bookingApi = {
	booking: async (
		listingId: string,
		startDate: string,
		endDate: string,
		guests: number,
		totalPrice: number
	) => {
		const res = await api.post("/booking", {
			listingId,
			startDate,
			endDate,
			guests,
			totalPrice,
		});
		return res.data;
	},
};
