import React from "react";

function DescriptionComp({ summary }) {
  return (
    <article className='max-md:max-w-full m-10 p-10 border-4'>
      <p>{summary}</p>
    </article>
  );
}

export default DescriptionComp;
