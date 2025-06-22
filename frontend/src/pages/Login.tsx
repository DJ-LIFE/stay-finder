import z from "zod";
import { useForm } from "react-hook-form";
// import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { userApi } from "../api/api";
import { useAuthStore } from "../store";

const loginSchema = z.object({
	email: z.string().email({ message: "Invalid email address" }),
	password: z
		.string()
		.min(6, { message: "Password must be at least 6 characters long" }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const Login = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		// watch,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});
	const login = useAuthStore((state) => state.login);
	const isLoading = useAuthStore((state) => state.isLoading);
	const setLoading = useAuthStore((state) => state.setLoading);
	// const initializeAuth = useAuthStore((state) => state.initializeAuth);
	const handleLogin = async (data: LoginFormData) => {
		try {
			setLoading(true);
			const res = await userApi.login(data.email, data.password);
			login(res.role, res.token, res.user);
		} catch (error) {
			console.error("Login failed:", error);
		} finally {
			setTimeout(() => {
				navigate("/");
				setLoading(false);
			}, 1000);
		}
	};
	// debugger

	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="loader bg-red-500 text-white">Loading ...</div>
			</div>
		);
	}

	// useEffect(() => {
	// 	initializeAuth();
	// }, []);

	return (
			<div className="container mx-auto p-4 mt-20">
				<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						{/* <img
						className="mx-auto h-10 w-auto"
						src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
						alt="Your Company"
					/> */}
						<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
							Sign in to your account
						</h2>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<form
							className="space-y-6"
							action="#"
							method="POST"
							onSubmit={handleSubmit(handleLogin)}
						>
							<div>
								<label
									htmlFor="email"
									className="block text-sm/6 font-medium text-gray-900"
								>
									Email address
								</label>
								<div className="mt-2">
									<input
										type="email"
										placeholder="email"
										{...register("email")}
										autoComplete="email"
										required
										className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									/>
									{errors.email && (
										<span className="text-red-500 text-sm">
											{errors.email.message}
										</span>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor="password"
									className="block text-sm/6 font-medium text-gray-900"
								>
									Password
								</label>
								<div className="mt-2">
									<input
										type="password"
										placeholder="Password"
										{...register("password")}
										name="password"
										id="password"
										autoComplete="current-password"
										required
										className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									/>
									{errors.password && (
										<span className="text-red-500 text-sm">
											{errors.password.message}
										</span>
									)}
								</div>
							</div>

							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
								>
									Sign in
								</button>
							</div>
						</form>

						<p className="mt-10 text-center text-sm/6 text-gray-500">
							Not a member?
							<button
								onClick={() => navigate("/register")}
								className="font-semibold text-indigo-600 hover:text-indigo-500"
							>
								Sign Up
							</button>
						</p>
					</div>
				</div>
			</div>
	);
};
