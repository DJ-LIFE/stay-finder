import { useEffect, useState } from "react";
import { listingApi } from "../api/api";
import { useNavigate } from "react-router";

interface Listings {
	_id: string;
	title: string;
	img: string;
	images: string[];
	propertyType: string;
	price: number;
	onClick: () => void;
}
const Listings = () => {
	const [listings, setListings] = useState<Listings[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchListings = async () => {
			setLoading(true);
			try {
				const res = await listingApi.getListings();

				setListings(res.data);
			} catch (error) {
				console.error("Failed to fetch listings:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchListings();
	}, []);
	console.log("listings", listings);
	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="loader bg-red-500 text-white">Loading ...</div>
			</div>
		);
	}
	return (
		<div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-10">
			{listings.map((listing) => (
				<Card
					key={listing._id}
					{...listing}
					img={listing.images[listing.images.length - 1]}
					onClick={() => navigate(`/listings/${listing._id}`)}
				/>
			))}
		</div>
	);
};

export default Listings;

const Card = ({ title, img, propertyType, price, onClick }: Listings) => {
	return (
		<div
			className="flex flex-col rounded-lg  cursor-pointer"
			onClick={onClick}
		>
			<div className="relative">
				<img
					src={img}
					alt={title}
					className="w-full h-48 object-cover rounded-2xl"
				/>
				<span className="absolute top-4 left-4 text-xs font-semibold text-neutral-800 biorder border-neutral-200 px-2 py-0.5 bg-neutral-100 rounded-full">
					{propertyType}
				</span>
			</div>
			<div className="px-2">
				<h3 className="text-sm font-semibold">{title}</h3>
				<p className="text-xs font-semibold text-neutral-500">
					₹{price} per night
				</p>
			</div>
		</div>
	);
};
