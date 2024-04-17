import React from "react";

function CourseOutline() {
  const sessions = [
    {
      title: "Session 1: Understanding the Basics of Graphic Design",
      topics: [
        "Introduction to Graphic Design",
        "Importance of Graphic Design in Visual Communication",
        "Overview of Design Principles: Balance, Proportion, Contrast, Harmony",
        "Introduction to Typography: Typeface, Font Families, Typography Hierarchy",
      ],
    },
    {
      title: "Session 2: Exploring Color Theory and Layout Design",
      topics: [
        "Understanding Color Theory: Color Wheel, Primary, Secondary, and Tertiary Colors",
        "Psychology of Color: How Color Impacts Emotions and Perception",
        "Introduction to Layout Design: Grid Systems, Composition, and Visual Hierarchy",
        "Hands-On Exercise: Creating a Mood Board to Explore Color and Layout Concepts",
      ],
    },
    {
      title: "Session 3: Introduction to Graphic Design Software",
      topics: [
        "Overview of Adobe Creative Suite: Photoshop, Illustrator, and InDesign",
        "Basic Tools and Functions in Photoshop: Layers, Selection Tools, Editing Tools",
        "Introduction to Vector Graphics and Illustration in Illustrator",
        "Layout Design and Typography in InDesign: Creating Multi-page Documents",
      ],
    },
    {
      title: "Session 4: Designing with Photoshop",
      topics: [
        "Practical Exercise: Creating a Digital Collage using Photoshop",
        "Understanding Image Resolution and File Formats",
        "Introduction to Photo Editing Techniques: Cropping, Resizing, Color Adjustments",
        "Tips for Creating Engaging and Eye-catching Designs",
      ],
    },
    {
      title: "Session 5: Creating Vector Graphics with Illustrator",
      topics: [
        "Practical Exercise: Designing a Logo or Icon using Illustrator",
        "Understanding Vector Graphics: Paths, Shapes, Pen Tool",
        "Working with Layers and Objects in Illustrator",
        "Exporting Vector Graphics for Web and Print",
      ],
    },
    {
      title: "Session 6: Layout Design with InDesign",
      topics: [
        "Practical Exercise: Designing a Flyer or Brochure using InDesign",
        "Mastering Text Layout and Typography in InDesign",
        "Incorporating Images and Graphics into Layouts",
        "Exporting Print-ready Files from InDesign",
      ],
    },
    {
      title: "Session 7: Review and Critique",
      topics: [
        "Reviewing Completed Projects and Assignments",
        "Providing Constructive Feedback and Critique",
        "Q&A Session: Addressing Participant Queries and Concerns",
        "Next Steps: Further Resources and Opportunities for Continued Learning",
      ],
    },
  ];

  return (
    <section className='max-md:max-w-full'>
      {sessions.map((session, index) => (
        <React.Fragment key={index}>
          <h3 className='font-bold'>{session.title}</h3>
          <ul>
            {session.topics.map((topic, topicIndex) => (
              <li key={topicIndex}>{topic}</li>
            ))}
          </ul>
          <br />
        </React.Fragment>
      ))}
      <p className='font-bold'>Note</p>
      <p>
        Each session will include a mix of theoretical concepts, practical
        demonstrations, and hands-on exercises to reinforce learning and skill
        development. Participants are encouraged to actively engage in
        discussions and share their work for feedback and critique.
      </p>
    </section>
  );
}

function DescriptionComp() {
  return (
    <article className='max-md:max-w-full'>
      <p>
        Welcome to the captivating world of Graphic Design! Graphic design is
        more than just creating visually appealing images; it's about
        effectively communicating messages, ideas, and emotions through visual
        elements.
      </p>
      <br />
      <p>
        In this introductory course, we'll embark on a journey to explore the
        foundations of graphic design, from understanding design principles to
        mastering essential tools and techniques. Whether you're a budding
        artist, a creative enthusiast, or someone looking to switch careers,
        this course will provide you with the knowledge and skills needed to
        thrive in the dynamic field of graphic design.
      </p>
      <br />
      <p>
        Throughout this course, you'll dive into the core concepts of design
        theory, typography, color theory, and layout principles. You'll discover
        how to wield industry-standard software like Adobe Photoshop,
        Illustrator, and InDesign, transforming your ideas into polished,
        professional-quality designs.
      </p>
      <br />
      <p>
        Get ready to unleash your creativity as we delve into a variety of
        design projects, ranging from logo design and branding to digital
        illustrations and print materials. Through hands-on practice and guided
        instruction, you'll learn to craft visually compelling designs that
        captivate audiences and leave a lasting impression.
      </p>
      <br />
      <p>
        Whether you aspire to become a professional graphic designer, enhance
        your current skill set, or simply explore your creative potential, this
        course will serve as your gateway to the exciting and rewarding world of
        graphic design. So, let's embark on this journey together and unlock the
        boundless possibilities of visual expression!
      </p>
      <br />
      <CourseOutline />
    </article>
  );
}

export default DescriptionComp;
