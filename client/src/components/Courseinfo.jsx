import React from "react";
import ProfileCard from "./ProfileCard";
import StatCard from "./StatCard";

export function Courseinfo() {
  const profileData = {
    name: "Mme.Ammari Yassmine",
    title: "University teacher and UI expert",
    profileImage:
      "https://cdn.builder.io/api/v1/image/assets/TEMP/403385f50620a71a1ade46203d696c801a194048245d29dc8a0d6bcbb338fa35?apiKey=ddad1c14c3cb468699f5d92dfd4189f9&",
  };

  const statData = [
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/eebed5ab82c0319b711bcfadc8035ca87fb2e9855c40d0aa87415d602224c56b?apiKey=ddad1c14c3cb468699f5d92dfd4189f9&",
      value: "3 Hours 48 Min",
      label: "Total time",
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/1ced1901fb017798248a9e6fe5e8c1bb17887b2c6fb8c7233f53c85c4d679ec4?apiKey=ddad1c14c3cb468699f5d92dfd4189f9&",
      value: "189 time enrolled",
      label: "Enrollment count",
    },
  ];

  return (
    <main className='justify-center px-0.5 pb-2 mt-10 max-w-full w-100%'>
      <div className='flex gap-5 max-md:flex-col max-md:gap-0'>
        <div className='flex flex-col w-[42%] max-md:ml-0 max-md:w-full'>
          <ProfileCard {...profileData} />
        </div>
        <div className='flex flex-col ml-5 w-[58%] max-md:ml-0 max-md:w-full'>
          <section className='grow max-md:mt-10 max-md:max-w-full'>
            <div className='flex gap-5 max-md:flex-col max-md:gap-0'>
              {statData.map((stat, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${
                    index === 0 ? "w-6/12" : "ml-5 w-6/12"
                  } max-md:ml-0 max-md:w-full`}
                >
                  <StatCard {...stat} />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

export default Courseinfo;
