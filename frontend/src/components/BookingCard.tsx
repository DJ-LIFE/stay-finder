import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { bookingApi } from "../api/api";
const bookingSchema = z
	.object({
		checkIn: z.string().min(1, "Check-in date is required"),
		checkOut: z.string().min(1, "Check-out date is required"),
		guests: z
			.number()
			.min(1, "At least one guest is required")
			.max(10, "Maximum 10 guests allowed"),
	})
	.refine(
		(data) => {
			// Ensure check-out is after check-in
			const checkIn = new Date(data.checkIn);
			const checkOut = new Date(data.checkOut);
			return checkOut > checkIn;
		},
		{
			message: "Check-out date must be after check-in date",
			path: ["checkOut"],
		}
	)
	.refine(
		(data) => {
			// Ensure dates are not in the past
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const checkIn = new Date(data.checkIn);
			return checkIn >= today;
		},
		{
			message: "Check-in date cannot be in the past",
			path: ["checkIn"],
		}
	);

type BookingFormData = z.infer<typeof bookingSchema>;

export const BookingCard = ({
	price,
	id,
}: {
	price: number | undefined;
	id: string | undefined;
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [bookingSuccess, setBookingSuccess] = useState(false);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<BookingFormData>({
		resolver: zodResolver(bookingSchema),
		defaultValues: {
			checkIn: "",
			checkOut: "",
			guests: 1,
		},
	});

	// Calculate nights and total price
	const checkIn = watch("checkIn");
	const checkOut = watch("checkOut");
	const guests = watch("guests");

	const nights = useMemo(() => {
		if (!checkIn || !checkOut) return 0;
		const start = new Date(checkIn);
		const end = new Date(checkOut);
		const diffTime = Math.abs(end.getTime() - start.getTime());
		return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
	}, [checkIn, checkOut]);

	const totalPrice = price ? price * nights * guests : 0;

	const onSubmit = async (data: BookingFormData) => {
		if (price === undefined || id === undefined) {
			console.error("Error getting price or id");
			return;
		}
		console.log(
			"Booking data:",
			data,
			"Total Price:",
			totalPrice,
			"ID:",
			id
		);

		try {
			setIsSubmitting(true);
			const response = await bookingApi.booking(
				id,
				data.checkIn,
				data.checkOut,
				data.guests,
				totalPrice
			);

			console.log("Booking successful:", response);
			setBookingSuccess(true);

		} catch (error) {
			console.error("Booking failed:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (bookingSuccess) {
		return (
			<div className="px-4 w-full py-8 my-4 max-w-100 rounded-2xl shadow-2xl">
				<div className="text-center">
					<h3 className="text-xl font-semibold text-green-600">
						Booking Successful!
					</h3>
					
				</div>
			</div>
		);
	}
	return (
		<div className="px-4 w-full py-8 my-4 max-w-100 rounded-2xl shadow-2xl">
			<form
				onSubmit={handleSubmit(onSubmit)}
				className="flex flex-col items-start gap-8"
			>
				<p>
					<span className="text-lg text-neutral-500 line-through">
						₹{price ? price + price * 0.25 : ""}
					</span>
					<span className="pl-1 underline text-lg">
						₹{price} For 1 night
					</span>
				</p>
				<div className="flex justify-between items-center gap-2 w-full">
					<div className="flex flex-col gap-2">
						<label
							htmlFor="check-in"
							className="text-sm font-medium text-gray-700"
						>
							Check-in
						</label>
						<input
							{...register("checkIn")}
							type="date"
							id="check-in"
							className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<label
							htmlFor="check-out"
							className="text-sm font-medium text-gray-700"
						>
							Check-out
						</label>
						<input
							{...register("checkOut")}
							type="date"
							id="check-out"
							className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
						/>
					</div>
				</div>
				<div className="flex flex-col gap-2 w-full">
					<label
						htmlFor="guests"
						className="text-sm font-medium text-gray-700"
					>
						Guests
					</label>
					<input
						{...register("guests")}
						type="number"
						id="guests"
						min={1}
						defaultValue={1}
						className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
					/>
				</div>

				<button
					type="submit"
					className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
				>
					Book Now
				</button>
			</form>
		</div>
	);
};
