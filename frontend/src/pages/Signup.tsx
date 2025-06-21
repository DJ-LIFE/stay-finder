import z from "zod";
import { useForm } from "react-hook-form";
// import { useAuthStore } from "../store/store";
// import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useAuthStore } from "../store";
import { userApi } from "../api/api";
import AuthLayout from "../layout/AuthLayout";

const signupSchema = z
	.object({
		name: z
			.string()
			.min(2, { message: "Name must be at least 2 characters long" }),
		role: z.enum(["host", "guest"], {
			message: "Role must be either 'host' or 'guest'",
		}),
		email: z.string().email({ message: "Invalid email address" }),

		password: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" }),
		confirmPassword: z
			.string()
			.min(6, { message: "Password must be at least 6 characters long" }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

type SignupFormData = z.infer<typeof signupSchema>;

export const Signup = () => {
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		formState: { errors },
	} = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: {
			email: "",
			password: "",
			confirmPassword: "",
			role: "guest",
		},
	});
	const signup = useAuthStore((state) => state.signup);
	const isLoading = useAuthStore((state) => state.isLoading);
	const setLoading = useAuthStore((state) => state.setLoading);
	const role = watch("role");
	const handleRegister = async (data: SignupFormData) => {
		try {
			setLoading(true);
			const res = await userApi.register(
				data.email,
				data.password,
				data.name,
				data.role
			);
			signup(res.role, res.token);
		} catch (error) {
		} finally {
			setTimeout(() => {
				navigate("/");
				setLoading(false);
			}, 1000);
		}
	};

	const setRole = (role: "host" | "guest") => {
		setValue("role", role);
	};
	console.log("role", role);
	return (
		<AuthLayout>
			<div className="container mx-auto p-4 h-screen">
				<div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
					<div className="sm:mx-auto sm:w-full sm:max-w-sm">
						{/* <img
						className="mx-auto h-10 w-auto"
						src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
						alt="Your Company"
					/> */}
						<h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
							Register your account
						</h2>
					</div>

					<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
						<form
							className="space-y-6"
							action="#"
							method="POST"
							onSubmit={handleSubmit(handleRegister)}
						>
							<div>
								<div className="flex items-center justify-between">
									<label
										htmlFor="email"
										className="block text-sm/6 font-medium text-gray-900"
									>
										Name
									</label>
									<div className="text-sm flex justify-between border border-gray-300 rounded-md bg-gray-50 px-3 py-1.5 gap-2">
										<div
											className={
												role === "guest"
													? "font-semibold text-indigo-600"
													: ""
											}
											onClick={() => setRole("guest")}
										>
											guest
										</div>
										<div
											className={
												role === "host"
													? "font-semibold text-indigo-600"
													: ""
											}
											onClick={() => setRole("host")}
										>
											host
										</div>
									</div>
								</div>

								<div className="mt-2">
									<input
										type="text"
										placeholder="Name"
										{...register("name")}
										autoComplete="name"
										required
										className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									/>
									{errors.name && (
										<span className="text-red-500 text-sm">
											{errors.name.message}
										</span>
									)}
								</div>
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
								<label
									htmlFor="confirmPassword"
									className="block text-sm/6 font-medium text-gray-900"
								>
									Confirm Password
								</label>
								<div className="mt-2">
									<input
										type="password"
										placeholder="Password"
										{...register("confirmPassword")}
										name="confirmPassword"
										id="confirmPassword"
										autoComplete="current-password"
										required
										className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
									/>
									{errors.confirmPassword && (
										<span className="text-red-500 text-sm">
											{errors.confirmPassword.message}
										</span>
									)}
								</div>
							</div>

							<div>
								<button
									type="submit"
									className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
								>
									Sign Up
								</button>
							</div>
						</form>

						<p className="mt-10 text-center text-sm/6 text-gray-500">
							Already a member?
							<button
								onClick={() => navigate("/login")}
								className="font-semibold text-indigo-600 hover:text-indigo-500"
							>
								Sign In
							</button>
						</p>
					</div>
				</div>
			</div>
		</AuthLayout>
	);
};
