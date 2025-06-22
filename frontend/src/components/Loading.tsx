import { Circle } from "lucide-react";

const Loading = () => {
	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
			<div className="flex flex-col items-center space-y-4 p-8 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 shadow-xl">
				<div className="relative">
					<Circle className="animate-spin h-8 w-8 text-blue-400" strokeWidth={2} />
					<div className="absolute inset-0 rounded-full bg-blue-400/20 animate-pulse"></div>
				</div>
				<p className="text-white/90 font-medium tracking-wide">Loading...</p>
			</div>
		</div>
	);
};

export default Loading;
