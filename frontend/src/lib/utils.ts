import type { PropertyDetailsProps } from "../types";

const renderImages = (propertyDetails: PropertyDetailsProps) => {
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
