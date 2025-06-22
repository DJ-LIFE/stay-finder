// {
//     "title": "Luxury Apartment in Mumbai",
//     "description": "A beautiful apartment with sea view",
//     "location": {
//         "address": "123 Ocean Drive",
//         "city": "Mumbai",
//         "state": "Maharashtra",
//         "country": "India",
//         "coordinates": [
//             72.8777,
//             19.0760
//         ]
//     },
//     "price": 2500,
//     "images": [
//         "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
//     ],
//     "amenities": [
//         "WiFi",
//         "Pool",
//         "Kitchen",
//         "Air conditioning"
//     ],
//     "maxGuests": 4,
//     "bedrooms": 2,
//     "bathrooms": 2,
//     "propertyType": "Apartment",
//     "availability": true
// }

import Input from "../components/ui/Input";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useState } from "react";
import { listingApi } from "../api/api";
import type { CreateListingsProps } from "../types";

const listingSchema = z.object({
	title: z.string().min(1, "Title is required"),
	description: z.string().min(1, "Description is required"),
	price: z.number().min(0, "Price must be a positive number"),
	maxGuests: z.number().min(1, "Max guests must be at least 1"),
	bedrooms: z.number().min(0, "Bedrooms cannot be negative"),
	bathrooms: z.number().min(0, "Bathrooms cannot be negative"),
	propertyType: z.string().min(1, "Property type is required"),
	images: z.array(z.string()).min(1, "At least one image is required"),
	amenities: z.array(z.string()).min(1, "At least one amenity is required"),
	location: z.object({
		address: z.string().min(1, "Address is required"),
		city: z.string().min(1, "City is required"),
		state: z.string().min(1, "State is required"),
		country: z.string().min(1, "Country is required"),
		coordinates: z
			.tuple([z.number(), z.number()])
			.refine((coords) => coords.length === 2, {
				message: "Coordinates must be an array of two numbers",
			}),
	}),
	availability: z.boolean(),
});

type CreateListingFormData = z.infer<typeof listingSchema>;
const CreateListings = () => {
	const navigate = useNavigate();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [amenities, setAmenities] = useState<string[]>(["WiFi"]);
	const [amenityInput, setAmenityInput] = useState("");

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		watch,
		formState: { errors },
	} = useForm<CreateListingFormData>({
		resolver: zodResolver(listingSchema),
		defaultValues: {
			title: "",
			description: "",
			price: 0,
			maxGuests: 1,
			bedrooms: 0,
			bathrooms: 0,
			propertyType: "",
			images: [""],
			amenities: ["WiFi"],
			location: {
				address: "",
				city: "",
				state: "",
				country: "",
				coordinates: [0, 0],
			},
			availability: true,
		},
	});

	const addMoreImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;

		if (files) {
			const newImages = Array.from(files).map((file) =>
				URL.createObjectURL(file)
			);
			setValue("images", [...getValues("images"), ...newImages]);
		}
	};

	const removeImage = (index: number) => {
		const currentImages = getValues("images");
		currentImages.splice(index, 1);
		setValue("images", currentImages);
	};

	const handleAddAmenity = () => {
		if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
			const newAmenities = [...amenities, amenityInput.trim()];
			setAmenities(newAmenities);
			setValue("amenities", newAmenities);
			setAmenityInput("");
		}
	};

	const handleRemoveAmenity = (index: number) => {
		const newAmenities = [...amenities];
		newAmenities.splice(index, 1);
		setAmenities(newAmenities);
		setValue("amenities", newAmenities);
	};

	const onSubmit = async (data: CreateListingFormData) => {
		try {
			setIsSubmitting(true);
			setSubmitError(null);

			// Format data according to the expected API structure
			const listingData: CreateListingsProps = {
				...data,
				availability: true,
			};

			await listingApi.createListings(listingData);
			navigate("/");
		} catch (error) {
			console.error("Error creating listing:", error);
			setSubmitError("Failed to create listing. Please try again.");
		} finally {
			setIsSubmitting(false);
		}
	};
	console.log(errors);

	return (
		<div className="container mx-auto p-4 mt-10">
			<h1 className="text-3xl font-semibold mb-10">Create Listings</h1>

			{submitError && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{submitError}
				</div>
			)}
			<form
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
				onSubmit={handleSubmit((data: CreateListingFormData) =>
					onSubmit(data)
				)}
			>
				<div className="space-y-1">
					<Input
						label="Title"
						title="title"
						type="text"
						{...register("title")}
					/>
					{errors.title && (
						<p className="text-red-500 text-sm">
							{errors.title.message}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Input
						label="Description"
						title="description"
						type="text"
						{...register("description")}
					/>
					{errors.description && (
						<p className="text-red-500 text-sm">
							{errors.description.message}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Input
						label="Price"
						title="price"
						type="number"
						{...register("price", { valueAsNumber: true })}
					/>
					{errors.price && (
						<p className="text-red-500 text-sm">
							{errors.price.message}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Input
						label="Max Guests"
						title="maxGuests"
						type="number"
						{...register("maxGuests", { valueAsNumber: true })}
					/>
					{errors.maxGuests && (
						<p className="text-red-500 text-sm">
							{errors.maxGuests.message}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Input
						label="Bedrooms"
						title="bedrooms"
						type="number"
						{...register("bedrooms", { valueAsNumber: true })}
					/>
					{errors.bedrooms && (
						<p className="text-red-500 text-sm">
							{errors.bedrooms.message}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Input
						label="Bathrooms"
						title="bathrooms"
						type="number"
						{...register("bathrooms", { valueAsNumber: true })}
					/>
					{errors.bathrooms && (
						<p className="text-red-500 text-sm">
							{errors.bathrooms.message}
						</p>
					)}
				</div>

				<div className="space-y-1">
					<Input
						label="Property Type"
						title="propertyType"
						{...register("propertyType")}
					/>
					{errors.propertyType && (
						<p className="text-red-500 text-sm">
							{errors.propertyType.message}
						</p>
					)}
				</div>

				{/* Images Section */}
				<div className="col-span-full mt-6 mb-4">
					<h2 className="text-xl font-semibold mb-4">Images</h2>
					<div>
						<label
							htmlFor="images"
							className="block text-sm font-medium text-gray-700"
						>
							Upload Images
						</label>
						<div className="mt-1">
							<input
								type="file"
								id="images"
								accept="image/*"
								multiple
								onChange={addMoreImage}
								className="block w-full text-sm text-gray-500
								file:mr-4 file:py-2 file:px-4
								file:rounded-md file:border-0
								file:text-sm file:font-semibold
								file:bg-indigo-600 file:text-white
								hover:file:bg-indigo-500"
							/>
						</div>
						{errors.images && (
							<p className="mt-1 text-sm text-red-600">
								{errors.images.message}
							</p>
						)}
					</div>

					{/* Image Preview Grid */}
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
						{watch("images")
							?.filter((img) => img && img !== "")
							.map((image, index) => (
								<div key={index} className="relative group">
									<img
										src={image}
										alt={`Property image ${index + 1}`}
										className="w-full h-40 object-cover rounded-md"
										onError={(e) => {
											(e.target as HTMLImageElement).src =
												"https://via.placeholder.com/300x200?text=Invalid+Image+URL";
										}}
									/>
									<button
										type="button"
										onClick={() => removeImage(index)}
										className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
									>
										×
									</button>
								</div>
							))}
					</div>
				</div>

				{/* Amenities Section */}
				<div className="col-span-full mb-4">
					<h2 className="text-xl font-semibold mb-4">Amenities</h2>
					<div className="flex items-end gap-2 mb-2">
						<div className="flex-grow">
							<Input
								label="Add Amenity"
								title="amenity"
								type="text"
								value={amenityInput}
								onChange={(
									e: React.ChangeEvent<HTMLInputElement>
								) => setAmenityInput(e.target.value)}
							/>
						</div>
						<button
							type="button"
							onClick={handleAddAmenity}
							className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
						>
							Add
						</button>
					</div>

					{errors.amenities && (
						<p className="text-red-500 text-sm mb-2">
							{errors.amenities.message}
						</p>
					)}

					<div className="flex flex-wrap gap-2 mt-2">
						{amenities.map((amenity, index) => (
							<div
								key={index}
								className="bg-gray-100 px-3 py-1 rounded-full flex items-center"
							>
								<span>{amenity}</span>
								<button
									type="button"
									onClick={() => handleRemoveAmenity(index)}
									className="ml-2 text-gray-500 hover:text-red-500"
								>
									×
								</button>
							</div>
						))}
					</div>
				</div>

				{/* Location Section */}
				<div className="col-span-full mb-4">
					<h2 className="text-xl font-semibold mb-4">Location</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<div className="space-y-1">
							<Input
								label="Address"
								title="address"
								{...register("location.address")}
							/>
							{errors.location?.address && (
								<p className="text-red-500 text-sm">
									{errors.location.address.message}
								</p>
							)}
						</div>

						<div className="space-y-1">
							<Input
								label="City"
								title="city"
								{...register("location.city")}
							/>
							{errors.location?.city && (
								<p className="text-red-500 text-sm">
									{errors.location.city.message}
								</p>
							)}
						</div>

						<div className="space-y-1">
							<Input
								label="State"
								title="state"
								{...register("location.state")}
							/>
							{errors.location?.state && (
								<p className="text-red-500 text-sm">
									{errors.location.state.message}
								</p>
							)}
						</div>

						<div className="space-y-1">
							<Input
								label="Country"
								title="country"
								{...register("location.country")}
							/>
							{errors.location?.country && (
								<p className="text-red-500 text-sm">
									{errors.location.country.message}
								</p>
							)}
						</div>

						<div className="space-y-1">
							<Input
								label="Latitude"
								title="latitude"
								type="number"
								step="any"
								{...register("location.coordinates.0", {
									valueAsNumber: true,
								})}
							/>
							{errors.location?.coordinates && (
								<p className="text-red-500 text-sm">
									{errors.location.coordinates.message}
								</p>
							)}
						</div>

						<div className="space-y-1">
							<Input
								label="Longitude"
								title="longitude"
								type="number"
								step="any"
								{...register("location.coordinates.1", {
									valueAsNumber: true,
								})}
							/>
						</div>
					</div>
				</div>

				<div className="col-span-full mt-4">
					{" "}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-indigo-300 disabled:cursor-not-allowed"
					>
						{isSubmitting ? "Creating..." : "Create Listing"}
					</button>
				</div>
			</form>
		</div>
	);
};

export default CreateListings;
