const SearchBar = ({
	searchQuery,
	setSearchQuery,
}: {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}) => {
	return (
		<div className="relative max-w-sm mx-auto mt-10">
			<input
				className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
				type="search"
				value={searchQuery}
				onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
					setSearchQuery(e.target.value)
				}
				placeholder="Search Property..."
			/>
		</div>
	);
};

export default SearchBar;
