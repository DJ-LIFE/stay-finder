export interface PropertyDetailsProps {
	_id: string;
	title: string;
	description: string;
	price: number;
	images: string[];
	amenities: string[];
	maxGuests: number;
	bedrooms: number;
	bathrooms: number;
	propertyType: string;
	location: {
		address: string;
		city: string;
		state: string;
		country: string;
		coordinates: [number, number];
	};
	hostId: {
		name: string;
		email: string;
	};
}

export interface CreateListingsProps {
	title: string;
	description: string;
	location: {
		address: string;
		city: string;
		state: string;
		country: string;
		coordinates: [number, number];
	};
	price: number;
	images: string[];
	amenities: string[];
	maxGuests: number;
	bedrooms: number;
	bathrooms: number;
	propertyType: string;
	availability: boolean;
}
