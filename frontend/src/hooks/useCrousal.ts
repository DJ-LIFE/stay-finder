import { useState } from "react";

export const useCrousal = (images: string[]) => {
	const [currentIndex, setCurrentIndex] = useState(0);

	const nextImage = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === images.length - 1 ? 0 : prevIndex + 1
		);
	};
	const prevImage = () => {
		setCurrentIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		);
	};
	const currentImage = images[currentIndex];
	const currentImageCount = currentIndex + 1;
	const totalImagesCount = images.length;

	return {
		currentIndex,
		nextImage,
		prevImage,
		currentImageCount,
		totalImagesCount,
		currentImage,
	};
};
