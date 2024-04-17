import React from "react";

function StatCard({ icon, value, label }) {
  return (
    <div className='flex grow gap-3 items-start px-11 py-11 w-full text-xl text-center text-black bg-white shadow-sm max-md:px-5 max-md:mt-10'>
      <img
        src={icon}
        alt={`Icon for ${label}`}
        className='shrink-0 self-start aspect-square fill-stone-800 w-[26px]'
      />
      <div className='flex-auto my-auto'>
        {value}
        <span className='sr-only'>{label}</span>
      </div>
    </div>
  );
}

export default StatCard;
