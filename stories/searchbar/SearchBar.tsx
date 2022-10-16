import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  onSearch: (search: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchText, setSearchText] = useState("");
  return (
    <div className="flex">
      <div className="relative text-gray-600 focus-within:text-gray-400 w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
          <button
            className="p-1 focus:outline-none focus:shadow-outline flex flex-col justify-center"
            onClick={() => {
              onSearch(searchText);
              setSearchText("");
            }}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} className="text-xl" />
          </button>
        </span>
        <input
          className="py-2 text-2xl  text-white bg-slate-800 rounded-md pl-10 focus:outline-none focus:bg-slate-200 focus:text-slate-800 w-full pr-2"
          placeholder="Search..."
          autoComplete="off"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              onSearch(searchText);
              setSearchText("");
            }
          }}
        />
      </div>
    </div>
  );
};
