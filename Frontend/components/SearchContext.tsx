import React, { createContext, useState, useContext } from "react";

const SearchContext = createContext<any>(null);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [lastSearches, setLastSearches] = useState<string[]>([]);

  // Add a search to the history
  const addSearch = (searchQuery: string) => {
    setLastSearches((prev) => {
      const updatedSearches = [
        searchQuery,
        ...prev.filter((s) => s !== searchQuery),
      ];
      return updatedSearches.slice(0, 10); // Keep only the last 10 searches
    });
  };

  // Remove a specific search from the history
  const removeSearch = (searchQuery: string) => {
    setLastSearches((prev) => prev.filter((s) => s !== searchQuery));
  };

  // Clear all searches from the history
  const clearSearches = () => {
    setLastSearches([]);
  };

  return (
    <SearchContext.Provider
      value={{ lastSearches, addSearch, removeSearch, clearSearches }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => useContext(SearchContext);
