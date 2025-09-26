import React from "react";
import { Link } from "react-router-dom";

const partners = [
  {
    title: "Government",
    img: "https://media.istockphoto.com/id/184085544/photo/indian-parliament-in-new-delhi-the-politic-government-of-india.jpg?s=612x612&w=0&k=20&c=jgnuN5ofwNGMaoVoMoXOLF-2OzRVj3QhD0IZD3HIUSg=",
    link: "/government",
  },
  {
    title: "Railway",
    img: "https://www.rajasthanindiatourdriver.com/img/traintour-train.jpg",
    link: "/railway",
  },
  {
    title: "Nagar Nigam",
    img: "https://housing.com/news/wp-content/uploads/2024/04/Key-facts-about-Nagar-Nigam-in-India-f.jpg",
    link: "/municipal-corporation",
  },
  {
    title: "Bus Stand",
    img: "https://images.hindustantimes.com/img/2024/07/10/1600x900/The-old-bus-stand--above--in-Ghaziabad--which-is-s_1720632940837.jpg",
    link: "/bus-stand",
  },
];

export default function WhoWeWorkWith() {
  return (
    
    <section className="py-16 bg-white">
      <div className="container">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-green-800 text-center mb-12">
          Who We Work With
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {partners.map((item, index) => (
            <Link
              key={index}
              to={item.link}
              className="block border rounded-xl overflow-hidden shadow-md hover:shadow-xl transform hover:scale-105 transition duration-300"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg md:text-xl font-semibold text-green-900">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
