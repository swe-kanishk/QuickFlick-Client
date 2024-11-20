import React from "react";
import { IoSearchSharp } from "react-icons/io5";
import { useSelector } from "react-redux";

function Explore() {
  const { isDark } = useSelector((store) => store.auth);
  return (
    <div
      className={`flex flex-col px-3 py-2 h-[calc(100vh-60px)] ${
        isDark ? "bg-[#151515] text-white" : "bg-white text-black"
      } `}
    >
      <div className="flex items-center justify-between border border-gray-600 rounded-lg overflow-hidden px-2 py-1">
      
        <input type="text" placeholder="search" className={`outline-none  ${isDark ? "bg-[#151515] text-white" : "bg-white text-black "} flex-grow`} />
        <IoSearchSharp className="cursor-pointer" />
      </div>
    </div>
  );
}

export default Explore;
