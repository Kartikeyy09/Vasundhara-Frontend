import React from "react";
import { Link } from "react-router-dom";

const images = [
  "https://images.livemint.com/img/2019/11/24/1600x900/railwayspti1_1574609298972.jfif",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIF4_DL47ybw-UG5lpOiZxK0Vm2A9CBvgeTA&s",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRgPBAi9RDhQ4s-Rl7CNESatlTUwQz5z3iemA&s",
  "https://images.moneycontrol.com/static-mcnews/2025/03/20250330082735_Indian-railways.jpg?impolicy=website&width=1280&height=720",
  "https://th-i.thgim.com/public/news/national/6wwiiz/article34653210.ece/alternates/FREE_1200/RailwaySanitaryWorkers",
  "https://financialexpresswpcontent.s3.amazonaws.com/uploads/2018/03/guwahati-new-image.jpg?w=374",
  "https://resize.indiatvnews.com/en/centered/newbucket/1200_675/2016/09/rail-employees-1475070216.jpg",
  "https://theearthview.in/wp-content/uploads/2021/07/INdian-railway_20200920_570_850.jpeg",
  
];

export default function Railway() {
  return (
    <div className="bg-white">
      {/* Hero Section with Centered Text */}
      <section
        className="relative h-[400px] flex items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('https://konkanrailway.com/sites/default/files/2025-01/4.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        {/* Centered Text */}
<div className="relative z-10 px-6">
  <p className="text-white text-xl md:text-2xl lg:text-2xl font-semibold leading-relaxed max-w-4xl mx-auto break-words">
    The Railway of India plays a vital role in the WASH sector, supporting private players and partnering with NGO to make safe sanitation a reality.
  </p>
</div>

      </section>

      {/* Content Section */}
<section className="container py-16 grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
  {/* Left Text */}
  <div className="order-2 md:order-1">
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-900 mb-6">
      Ensuring Access to Safe Sanitation
    </h2>
    <p className="text-gray-700 leading-relaxed mb-6 text-sm md:text-base lg:text-lg max-w-2xl break-words">
      As a part of Swach Bharat Mission (SBM), Nirgandh has worked closely
      with the Zila Parishad of Nuh (Haryana) to provide community toilets
      in 42 villages. These facilities are also designed for specially
      abled users. A variety of materials like FRP, Cement Boards and
      Brick and Mortar have been used for these installations.
    </p>

    <button className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-full shadow-md transition">
      <Link to="/contact-us" className="px-2 py-1 flex items-center hover:text-green-600">
      Enquire Now      </Link>
    </button>
  </div>

  {/* Right Image */}
  <div className="flex justify-center order-1 md:order-2">
    <img
      src="https://s3.youthkiawaaz.com/wp-content/uploads/2019/10/01170425/Website-Thumbnail-open-defecation-along-railway-tracks.jpg"
      alt="Safe Sanitation"
      className="rounded-2xl shadow-lg w-full max-w-md h-[350px] object-cover"
    />
  </div>
</section>


      {/* WHY GOVERNMENT Section */}
      <section className="bg-white py-16">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-extrabold text-green-900 mb-6">
            WHY RAILWAY?
          </h2>
          <p className="text-gray-700 leading-relaxed text-base md:text-lg">
            The youth comprises over one-third of the Indian population which
            in turn constitutes a major part of the labour force of the country.
            A country like India which has a huge young population can reap
            better benefits from the demographic dividend if its youth are
            better skilled and employable. It is crucial for the energy of the
            underprivileged youth to be channelized properly with proper
            direction to aid economic growth and nation building. A country like India which has a huge young population can reap
            better benefits from the demographic dividend if its youth are
            better skilled and employable. It is crucial for the energy of the
            underprivileged youth to be channelized properly with proper
            direction to aid economic growth and nation building.
          </p>
        </div>
      </section>

      {/* WHAT WE DO Section */}
<section className="py-16">
  <div className="container grid md:grid-cols-2 gap-10 lg:gap-16 items-center">
    {/* Left Image */}
    <div className="flex justify-center order-1 md:order-1">
      <img
        src="https://pibindia.wordpress.com/wp-content/uploads/2015/10/26rail-bud4.jpg"
        alt="Livelihood Programme"
        className="rounded-2xl shadow-lg w-full max-w-md h-[350px] object-cover"
      />
    </div>

    {/* Right Text */}
    <div className="order-2 md:order-2">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-900 mb-6">
        WHAT WE DO
      </h2>
      <p className="text-gray-900 leading-relaxed mb-6 text-sm md:text-base lg:text-lg max-w-2xl break-words">
        Smile Foundation through its Livelihood programme connects the
        unemployed or underemployed youth from disadvantaged groups and
        communities with the sectors which have large growth potential in
        terms of revenue generation and employability. The staggering
        youth population underutilised in the job market because of a lack
        of requisite qualifications and training are upskilled, uplifted,
        and mainstreamed to become a part of the country’s growth story.
        The livelihood programme aims to complement the government’s
        vision and efforts under the Skill India mission, and is aligned
        with the Sustainable Development Goals 4 and 8.
      </p>
    </div>
  </div>
</section>



<section className="bg-white-50 py-16 px-10">
      <div className="container mx-auto flex flex-col md:flex-row items-start gap-10">
        {/* Left Text Section */}
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-green-900 mb-6">
            Sustainable Solutions to Railways Sanitation
          </h2>
          <p className="text-gray-700 leading-relaxed mb-6">
            The most effective way to combat world hunger is not merely through
            the distribution of food packs, which offer only short-term relief,
            but through investing in sustainable farming in regions lacking the
            resources to implement it themselves. Many countries in Africa and
            Asia suffer from widespread poverty, leaving them without the funds
            needed to build a strong agricultural sector. Local communities
            working these farms are often no better off—only able to grow just
            enough food to barely survive.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We have already made a difference in the lives of millions, but it
            is still not enough. Global conflicts, economic recessions, and
            unprecedented shifts on the world stage mean that hunger continues
            to rise despite our efforts. As a result, the need for volunteers
            and donations has never been greater. With your generously donated
            time and money, we are able to train volunteers, distribute food
            packs, provide agricultural kits, and establish modern, high-tech
            farms in the regions that need them most.
          </p>
        </div>

        {/* Right Image Grid */}
        <div className="md:w-1/3 grid grid-cols-2 gap-4">
          <img
            src="https://www.shutterstock.com/image-photo/world-environment-day-business-corporate-600nw-2471515609.jpg"
            alt="Farming 1"
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
          <img
            src="https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=400&q=80"
            alt="Farming 2"
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
          <img
            src="https://img.jagranjosh.com/images/2021/June/462021/World-environment-day-2021-theme-host-country-schemes-towards-clean-and-green-India.jpg"
            alt="Farming 3"
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80"
            alt="Farming 4"
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
        </div>
      </div>
    </section>



    <section className="bg-white py-16">
      <div className="container mx-auto px-4">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-green-900 text-center mb-12">
          Image Gallery
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((src, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
            >
              <img
                src={src}
                alt={`Gallery ${index + 1}`}
                className="w-full h-60 object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>

    </div>
  );
}
