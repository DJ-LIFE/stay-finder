import { useState, useEffect } from "react";

const useIsMobile = (breakpoint = 768) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const mediaQuery = window.matchMedia(`(max-width: ${breakpoint}px)`);

		const handleMediaQueryChange = (event: MediaQueryListEvent) => {
			setIsMobile(event.matches);
		};

		// Initial check
		setIsMobile(mediaQuery.matches);

		// Listen for changes
		mediaQuery.addEventListener("change", handleMediaQueryChange);

		// Cleanup
		return () => {
			mediaQuery.removeEventListener("change", handleMediaQueryChange);
		};
	}, [breakpoint]);

	return isMobile;
};

export default useIsMobile;
