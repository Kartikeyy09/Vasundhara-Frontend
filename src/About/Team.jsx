import React from "react";

export default function TeamSection() {
  const team = [
    {
      name: "Madhu S Thakar",
      role: "Founder",
      img: "https://randomuser.me/api/portraits/men/32.jpg",
      desc: "Passionate about driving social change and empowering communities.",
    },
    {
      name: "Ashish Mehrotra",
      role: "Co-Founder",
      img: "https://randomuser.me/api/portraits/men/44.jpg",
      desc: "Focused on building sustainable programs for the underprivileged.",
    },
    {
      name: "Saumya Chandra",
      role: "Co-Founder",
      img: "https://randomuser.me/api/portraits/women/45.jpg",
      desc: "Dedicated to women empowerment and child education initiatives.",
    },
    {
      name: "Ankit Sharma",
      role: "Co-Founder",
      img: "https://randomuser.me/api/portraits/men/22.jpg",
      desc: "Works closely with government bodies for social development.",
    },
    {
      name: "Priya Singh",
      role: "Coordinator",
      img: "https://randomuser.me/api/portraits/women/65.jpg",
      desc: "Leads multiple grassroots projects to maximize local impact.",
    },
    {
      name: "Ravi Verma",
      role: "Volunteer Lead",
      img: "https://randomuser.me/api/portraits/men/12.jpg",
      desc: "Manages volunteer programs and community outreach drives.",
    },
  ];

  return (
    <div className="bg-white">
      {/* Top Banner */}
      <div className="relative h-[380px] w-full mt-16">
        <img
          src="https://img.freepik.com/free-photo/human-resource-concept-with-people-icons_53876-120651.jpg"
          alt="Welcome Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white bg-green-900 px-6 py-3 rounded-lg shadow-lg">
            WELCOME TO OUR TEAM
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <section className="container py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-6">
          WHY TEAM IS IMPORTANT ?
        </h2>
        <p className="text-gray-800 leading-relaxed text-base md:text-lg max-w-4xl">
          A team is important because it brings together diverse skills, ideas,
          and perspectives to achieve a common goal. When people work as a team,
          they can share responsibilities, solve problems more effectively, and
          support one another through challenges. Teamwork also builds trust,
          improves communication, and encourages creativity, leading to better
          decision-making and stronger results. No matter how talented an
          individual is, the combined effort of a dedicated team always leads to
          greater success and lasting impact.When people work as a team,
          they can share responsibilities, solve problems more effectively, and
          support one another through challenges. Teamwork also builds trust,
          improves communication, and encourages creativity, leading to better
          decision-making and stronger results. No matter how talented an
          individual is, the combined effort of a dedicated team always leads to
          greater success and lasting impact.
        </p>
      </section>

      {/* Team Cards */}
      <section className="container py-16 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
        {team.map((member, index) => (
          <div
            key={index}
            className="relative bg-green-50 shadow-lg rounded-2xl text-center transition duration-300 hover:shadow-2xl hover:-translate-y-2"
          >
            {/* Decorative Half Background */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-green-200 rounded-t-2xl"></div>

            {/* Image */}
            <div className="relative flex justify-center pt-8">
              <img
                src={member.img}
                alt={member.name}
                className="w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-green-800 shadow-md object-cover bg-white"
              />
            </div>

            {/* Content */}
            <div className="py-8 px-4 relative z-10">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {member.name}
              </h2>
              <p className="text-sm text-gray-600 mt-2">{member.desc}</p>
              <div className="mt-4 inline-block bg-green-700 text-white font-semibold py-1 px-4 text-sm rounded-md shadow-md">
                {member.role}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
