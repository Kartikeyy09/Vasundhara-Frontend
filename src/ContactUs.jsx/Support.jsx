import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Support() {
  return (
    <section className="bg-white">
      {/* Banner with centered text */}
      <div className="relative w-full h-[400px]">
        <img
          src="https://emfavour.com/wp-content/uploads/2023/12/cloud4c-company-contact-1Desktop.jpg"
          alt="Contact Banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            CONTACT US
          </h1>
        </div>
      </div>

      
    </section>
  );
}
