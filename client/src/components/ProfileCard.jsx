import React from "react";

function ProfileCard({ name, title, profileImage }) {
  return (
    <div className='flex grow gap-3.5 px-7 py-2.5 w-full text-white bg-zinc-800 max-md:px-5 max-md:mt-10'>
      <img
        src={profileImage}
        alt={`Profile picture of ${name}`}
        className='shrink-0 max-w-full shadow-md aspect-[1.04] w-[101px]'
      />
      <div className='flex flex-col self-start mt-2.5'>
        <h2 className='text-xl font-bold'>{name}</h2>
        <p className='mt-2.5 text-sm font-semibold'>{title}</p>
      </div>
    </div>
  );
}

export default ProfileCard;
