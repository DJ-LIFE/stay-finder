import { Circle } from "lucide-react";

const Loading = () => {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="loader text-white">
				<Circle className="animate-spin" /> Loading ...
			</div>
		</div>
	);
};

export default Loading;
