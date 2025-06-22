import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { listingApi } from "../api/api";
import type { PropertyDetailsProps } from "../types";
import Loading from "../components/Loading";
import { useCrousal } from "../hooks/useCrousal";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useIsMobile from "../hooks/useMobileHook";
import { BookingCard } from "../components/BookingCard";
import { Map } from "../components/Map";

const PropertyDetail = () => {
	const [propertyDetails, setPropertyDetails] =
		useState<PropertyDetailsProps | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [popup, setPopup] = useState<boolean>(false);
	const { id } = useParams();

	const {
		currentIndex,
		nextImage,
		prevImage,
		currentImageCount,
		totalImagesCount,
		currentImage,
	} = useCrousal(propertyDetails?.images || []);

	const isMobile = useIsMobile();

	useEffect(() => {
		const fetchPropertyDetails = async () => {
			try {
				setLoading(true);
				const res = await listingApi.getListingById(id as string);
				setPropertyDetails(res.data);
			} catch (error) {
				console.error("Failed to fetch property details:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchPropertyDetails();
	}, [id]);

	if (loading) {
		return <Loading />;
	}
	const renderImages = () => {
		return propertyDetails?.images.map(
			(image, index) =>
				index >= 1 &&
				index <= 4 && (
					<img
						key={index}
						src={image}
						alt={`Property image ${index + 1}`}
						className=" hover:shadow-2xl hover:scale-101 transition-transform duration-300 ease-in-out cursor-pointer"
					/>
				)
		);
	};
	console.log("propertyDetails", propertyDetails);
	return (
		<>
			<div className="container transition-all duration-200 ease-in-out mx-auto p-4 pb-20 mt-10">
				<div>
					{isMobile ? (
						<div className="relative">
							<button
								onClick={prevImage}
								className={`${
									currentIndex === 0 ? "hidden" : ""
								} absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer`}
							>
								<ArrowLeft className="text-neutral-800 bg-transparent rounded-full p-1" />
							</button>
							<img
								src={currentImage}
								alt=""
								className="rounded-2xl"
							/>
							<button
								onClick={nextImage}
								className={`${
									currentIndex === totalImagesCount - 1
										? "hidden"
										: ""
								} absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer`}
							>
								<ArrowRight className="text-neutral-800 bg-transparent rounded-full p-1" />
							</button>
							<p className="absolute bottom-4 right-5 text-xs px-2 py-0.5 rounded-sm bg-black bg-opacity-20 text-white text-opacity-100">
								{currentImageCount} / {totalImagesCount}
							</p>
						</div>
					) : (
						<div className="grid grid-cols-2 gap-4 shadow-xs bg-transparent rounded-2xl overflow-clip">
							<img
								src={currentImage}
								alt=""
								className="object-cover h-full m-0 cursor-pointer hover:shadow-2xl hover:scale-101 transition-transform duration-300 ease-in-out"
							/>
							<div className="grid grid-cols-2 gap-4 rounded-r-2xl p-0 w-full h-full">
								{renderImages()}
							</div>
						</div>
					)}
					<div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-8">
						<div>
							<h1 className="text-2xl font-semibold my-5">
								{propertyDetails?.title}
							</h1>
							<p className="mt-2 text-neutral-600 text-balance text-sm">
								{propertyDetails?.description}
							</p>

							<p className="text-base font-semibold border-b border-neutral-300 py-2 pb-4">
								Hosted By {propertyDetails?.hostId.name}
							</p>
							{/* <p>{propertyDetails?.hostId.email}</p> */}
							<div>
								{propertyDetails?.amenities && (
									<div className="mt-4">
										<h2 className="text-xl font-medium">
											What this place offers
										</h2>
										<ul className="pl-5">
											{propertyDetails.amenities.map(
												(amenity, index) => (
													<li
														key={index}
														className="text-neutral-600 text-sm "
													>
														{amenity}
													</li>
												)
											)}
										</ul>
									</div>
								)}
							</div>
							<div className="mt-4">
								<h2 className="text-xl font-semibold">
									Location
								</h2>
								<p className="text-neutral-600 text-sm">
									{propertyDetails?.location.address}
									{propertyDetails?.location.city},{" "}
									{propertyDetails?.location.state},{" "}
									{propertyDetails?.location.country}
								</p>

								<Map
									coordinates={{
										lat:
											propertyDetails?.location
												.coordinates[0] || 0,
										lng:
											propertyDetails?.location
												.coordinates[1] || 0,
									}}
									name={propertyDetails?.title || "Property"}
								/>
							</div>
						</div>
						<div className="hidden md:block">
							<BookingCard
								price={propertyDetails?.price}
								id={id}
							/>
						</div>
						{popup && (
							<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
								<div className="bg-white p-6 rounded-lg shadow-sm w-full max-w-md">
									<BookingCard
										price={propertyDetails?.price}
										id={id}
									/>
									<button
										className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
										onClick={() => setPopup(false)}
									>
										&times;
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
			<div className="md:hidden fixed bottom-0 z-50 bg-white px-4 w-full py-4 my-4">
				<div className="flex justify-between items-center ">
					<p>
						<span className="text-sm text-neutral-500 line-through">
							₹
							{propertyDetails?.price
								? propertyDetails.price +
								  propertyDetails.price * 0.25
								: ""}
						</span>
						<span className="pl-1 underline">
							₹{propertyDetails?.price || 0}
						</span>
					</p>
					<button
						type="submit"
						className=" rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
						onClick={() => setPopup(true)}
					>
						Book Now
					</button>
				</div>
			</div>
		</>
	);
};

export default PropertyDetail;
