import React from "react";
import { IoMdPeople } from "react-icons/io";

function StatCard({ value, label }) {
  console.log(label);
  return (
    <div className='flex grow gap-3 items-start px-11 py-11 w-full text-xl text-center text-black bg-white shadow-sm max-md:px-5 max-md:mt-10'>
      <div className='self-center'>
        <IoMdPeople />
      </div>
      <div className='flex-auto my-auto'>
        {value}
        <span> &nbsp;{label}</span>
      </div>
    </div>
  );
}

export default StatCard;
