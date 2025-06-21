// "data": {
//         "location": {
//             "address": "123 Ocean Drive",
//             "city": "Mumbai",
//             "state": "Maharashtra",
//             "country": "India",
//             "coordinates": [
//                 72.8777,
//                 19.076
//             ]
//         },
//         "_id": "6855e8c35edd0c43f617fb2d",
//         "hostId": {
//             "_id": "6855d654bdfb2203fac977d4",
//             "email": "john@gmail.com",
//             "name": "John Desuza"
//         },
//         "title": "Luxury Apartment in Mumbai",
//         "description": "A beautiful apartment with sea view",
//         "price": 2500,
//         "images": [
//             "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688"
//         ],
//         "amenities": [
//             "WiFi",
//             "Pool",
//             "Kitchen",
//             "Air conditioning"
//         ],
//         "maxGuests": 4,
//         "bedrooms": 2,
//         "bathrooms": 2,
//         "propertyType": "Apartment",
//         "availability": true,
//         "createdAt": "2025-06-20T23:03:31.784Z",
//         "updatedAt": "2025-06-20T23:03:31.784Z",
//         "__v": 0
//     }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { listingApi } from "../api/api";
import type { PropertyDetailsProps } from "../types";
import Loading from "../components/Loading";
import { useCrousal } from "../hooks/useCrousal";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useIsMobile from "../hooks/useMobileHook";

const PropertyDetail = () => {
	const [propertyDetails, setPropertyDetails] =
		useState<PropertyDetailsProps | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();
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
		<div className="container transition-all duration-200 ease-in-out mx-auto p-4">
			<div>
				<h1 className="text-2xl font-bold my-5">
					{propertyDetails?.title}
				</h1>
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
				<p className="mt-2">{propertyDetails?.description}</p>
				<p className="mt-2">Price: ${propertyDetails?.price}</p>
				<div className="mt-4">
					<h2 className="text-xl font-semibold">Location</h2>
					<p>{propertyDetails?.location.address}</p>
					<p>
						{propertyDetails?.location.city},{" "}
						{propertyDetails?.location.state},{" "}
						{propertyDetails?.location.country}
					</p>
				</div>
				<div className="mt-4">
					<h2 className="text-xl font-semibold">Host</h2>
					<p>{propertyDetails?.hostId.name}</p>
					<p>{propertyDetails?.hostId.email}</p>
				</div>
			</div>
		</div>
	);
};

export default PropertyDetail;
