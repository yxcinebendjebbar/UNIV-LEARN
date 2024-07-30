import React from "react";
import ProfileCard from "./ProfileCard";
import StatCard from "./StatCard";

export function Courseinfo({ profileData, statData }) {
  return (
    <main className="justify-center px-0.5 pb-2 mt-10 max-w-full w-100%">
      <div className="flex gap-5 max-md:flex-col max-md:gap-0">
        <div className="flex flex-col w-[42%] max-md:ml-0 max-md:w-full">
          <ProfileCard
            name={profileData?.fullName}
            profileImage={`https://univ-learn.onrender.com/${profileData?.profilePicture.slice(
              7
            )}`}
          />
        </div>
        <div className="flex flex-col ml-5 w-[58%] max-md:ml-0 max-md:w-full">
          <section className="grow max-md:mt-10 max-md:max-w-full">
            <div className="flex gap-5 max-md:flex-col max-md:gap-0">
              <StatCard value={statData} label="Students Enrolled." />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Courseinfo;
