import React from "react";
import { Binoculars, Mountain, Star } from "lucide-react";

export default function VisionMission() {
  const cards = [
    {
      title: "Our Vision",
      color: "bg-green-600",
      textColor: "text-green-700",
      icon: <Binoculars className="w-6 h-6 text-white" />,
      points: [
        "Place your description here. Write your text here. Place your description here.",
        "Write your text here. Place your description here. Write your text here.",
      ],
    },
    {
      title: "Our Mission",
      color: "bg-green-600",
      textColor: "text-green-700",
      icon: <Mountain className="w-6 h-6 text-white" />,
      points: [
        "Place your description here. Write your text here. Place your description here.",
        "Write your text here. Place your description here. Write your text here.",
      ],
    },
    {
      title: "Our Values",
      color: "bg-green-600",
      textColor: "text-green-700",
      icon: <Star className="w-6 h-6 text-white" />,
      points: [
        "Place your description here. Write your text here. Place your description here.",
        "Write your text here. Place your description here. Write your text here.",
      ],
    },
  ];

  return (
    <div className="bg-white mt-20">
      {/* Hero Section */}
      <section className="relative w-full min-h-[200px] md:min-h-[350px]">
        {/* Background Image */}
        <img
          src="https://i0.wp.com/base.ac.in/wp-content/uploads/2018/10/vision-mission-banner-e1539427773777.png?ssl=1"
          alt="Mission Banner"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Text Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4">
          <h1 className="text-2xl md:text-5xl font-bold text-white bg-green-900/80 px-6 py-2 rounded-lg shadow-lg">
            A MISSION WITH A VISION
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-6">
          BAL RAKSHA BHARAT MISSION AND VISION
        </h2>
        <p className="text-gray-800 leading-relaxed text-base md:text-lg max-w-4xl">
          Bal Raksha Bharat is India’s leading independent child rights’ NGO,
          which works in 19 states and 3 Union Territories of India. Beginning
          its journey in 2004, we have changed the lives of millions of children
          by ensuring their right to education, healthcare, protection, and a
          happy childhood. We firmly believe that every child deserves the best
          chance for a bright future, which is why, we are fiercely committed to
          ensure that children not only survive, but thrive. With a bold
          ambition and a powerful vigilance, we do whatever it takes to Save
          Children. In India and across the world, Bal Raksha Bharat works
          on-ground.We firmly believe that every child deserves the best
          chance for a bright future, which is why, we are fiercely committed to
          ensure that children not only survive, but thrive. With a bold
          ambition and a powerful vigilance, we do whatever it takes to Save
          Children. In India and across the world, Bal Raksha Bharat works
          on-ground –
        </p>
      </section>

            {/* Vision & Mission Blocks */}
      <section className="grid md:grid-cols-2 auto-rows-fr">
        {/* Vision */}
        <div className="flex items-center justify-center bg-purple-100 p-6 text-center min-h-[280px]">
          <div className="max-w-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-3">Our Vision</h2>
            <p className="text-sm md:text-base leading-relaxed">
              Build a world in which every child has the right to survival,
              protection, development, and participation.Build a world in which every child has the right to survival,
              protection, development, and participation
            </p>
          </div>
        </div>

        <div className="relative h-[280px]">
          <img
            src="https://media.istockphoto.com/id/500504909/photo/business-vision.jpg?s=612x612&w=0&k=20&c=sfAyloZ4GkAkZQ7KIm_Jeg33a4Z-HuR7lTijWbRN95g="
            alt="Vision"
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-purple-200/60"></div>
        </div>

        {/* Mission */}
        <div className="relative h-[280px]">
          <img
            src="https://images.unsplash.com/photo-1509099836639-18ba1795216d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
            alt="Mission"
            className="w-full h-full object-cover rounded-md"
          />
          <div className="absolute inset-0 bg-red-200/60"></div>
        </div>

        <div className="flex items-center justify-center bg-pink-100 p-6 text-center min-h-[280px]">
          <div className="max-w-sm">
            <h2 className="text-xl md:text-2xl font-bold mb-3">Our Mission</h2>
            <p className="text-sm md:text-base leading-relaxed">
              To inspire breakthroughs in the way the world treats children, and
              to achieve immediate, and lasting change in their lives.To inspire breakthroughs in the way the world treats children, and
              to achieve immediate, and lasting change in their lives
            </p>
          </div>
        </div>
      </section>


      {/* Main Content */}
      <section className="container py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-6">
          OUR MISSION
        </h2>
        <p className="text-gray-800 leading-relaxed text-base md:text-lg max-w-4xl">
          Bal Raksha Bharat is India’s leading independent child rights’ NGO,
          which works in 19 states and 3 Union Territories of India. Beginning
          its journey in 2004, we have changed the lives of millions of children
          by ensuring their right to education, healthcare, protection, and a
          happy childhood. 
        </p>
      </section>


       {/* Main Content */}
      <section className="container py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-6">
          OUR VISION
        </h2>
        <p className="text-gray-800 leading-relaxed text-base md:text-lg max-w-4xl">
          Bal Raksha Bharat is India’s leading independent child rights’ NGO,
          which works in 19 states and 3 Union Territories of India. Beginning
          its journey in 2004, we have changed the lives of millions of children
          by ensuring their right to education, healthcare, protection, and a
          happy childhood. 
        </p>
      </section>

      {/* Main Content */}
      <section className="container py-12">
        <h2 className="text-2xl md:text-3xl font-extrabold text-green-900 mb-6">
          OUR GOAL
        </h2>
        <p className="text-gray-800 leading-relaxed text-base md:text-lg max-w-4xl">
          Bal Raksha Bharat is India’s leading independent child rights’ NGO,
          which works in 19 states and 3 Union Territories of India. Beginning
          its journey in 2004, we have changed the lives of millions of children
          by ensuring their right to education, healthcare, protection, and a
          happy childhood. 
        </p>
      </section>


      {/* Cards Section */}
<section className="py-16 bg-gradient-to-b from-green-900 to-white">
  <div className="container grid md:grid-cols-3 gap-10 px-6">
    {cards.map((card, index) => (
      <div
        key={index}
        className="relative group transform transition duration-500 hover:scale-105"
      >
        {/* Wrapper: Icon + Card dono ek sath */}
        <div className="relative flex flex-col items-center transition-transform duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
          {/* Icon Tab */}
          <div
            className={`${card.color} relative z-20 px-4 py-3 rounded-full shadow-lg`}
          >
            {card.icon}
          </div>

          {/* Card */}
          <div className="bg-white border border-green-900 rounded-2xl shadow-md pt-12 pb-10 px-8 min-h-[320px] w-full flex flex-col justify-start mt-[-24px]">
            <h3
              className={`text-xl md:text-2xl font-extrabold mb-6 ${card.textColor} group-hover:text-green-900`}
            >
              {card.title}
            </h3>
            <ul className="space-y-4 text-gray-700 text-base leading-relaxed list-disc list-inside">
              {card.points.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>



      
    </div>
  );
}
