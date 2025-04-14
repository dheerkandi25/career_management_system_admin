import React from "react";

interface SearchComponentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onSearch: () => void;
  searchResults: any[];
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  searchTerm,
  setSearchTerm,
  onSearch,
  searchResults,
}) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Search applicants..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} // Update the search term in the parent
        className="mb-4 p-2 border border-gray-300 rounded w-full"
      />
      <button
        onClick={onSearch} // Trigger the search function in the parent
        className="mb-4 p-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>
      {searchResults.length > 0 && (
        <div className="overflow-auto max-h-screen">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                {Object.keys(searchResults[0]).map((key) => (
                  <th key={key} className="py-2 px-4 border-b text-black">{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result, index) => (
                <tr key={index}>
                  {Object.values(result).map((value, idx) => (
                    <td key={idx} className="py-2 px-4 border-b text-black">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;