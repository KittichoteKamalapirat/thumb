interface Props {
  query: string;
  onChange: (text: string) => void;
  handleSearch?: () => void;
  placehodler?: string;
}

const Searchbar = ({
  query,
  onChange,
  handleSearch,
  placehodler = "search",
}: Props) => {
  return (
    <div className="flex gap-2">
      <div id="left" className="flex w-full">
        <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 rounded-l-md border border-r-0 border-gray-300 ">
          <svg
            aria-hidden="true"
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </span>
        <input
          type="search"
          id="default-search"
          className="block p-2 pl-4 w-full text-gray-900 bg-gray-50 rounded-r-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placehodler}
          onChange={(e) => onChange(e.target.value)}
          value={query}
        />
      </div>
      {/* <Button label="Search" onClick={handleSearch} /> */}
    </div>
  );
};
export default Searchbar;
