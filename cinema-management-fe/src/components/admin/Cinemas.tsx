import React, { useState, ChangeEvent } from "react";
import Cinema from "./items/Cinema";
import SearchImg from "../../assets/images/search.svg";
import { exampleCinemas } from "../../data";

const Cinemas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  //   const handleDeleteClick = () => {
  //     alert("Delete Btn clicked");
  //   };

  //   const handleAddNewClick = () => {
  //     alert("Add New Btn clicked");
  //   };

    const filteredCinemas = exampleCinemas.filter((cinema) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (cinema.cinema_id && cinema.cinema_id.toString().includes(searchTermLower)) ||
        (cinema.address && cinema.address.toLowerCase().includes(searchTermLower)) ||
        (cinema.name && cinema.name.toLowerCase().includes(searchTermLower))
      );
    });

  return (
    <div className="cinemas flex flex-col h-[673px] relative">
      <div className="text-40px font-medium text-dark-gray">Cinemas</div>
      <div className="SearchBar relative w-full max-w-[240px] h-8 mt-2">
        <input
          type="text"
          className="size-full pl-10 pr-5 text-sm text-dark-gray rounded-full text-gray-700 bg-white border-line-gray border-2 focus:outline-none focus:ring-1"
          placeholder="Search"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <img
          src={SearchImg}
          alt="Search"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4"
        />
      </div>

      <div className="content mt-[14px] w-full h-full">
        <div className="gap-y-8 py-3 overflow-y-auto flex flex-col lg:grid lg:grid-cols-2 xl:grid-cols-3">
          {filteredCinemas.map((cinema, index) => (
            <Cinema key={index} {...cinema} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cinemas;
