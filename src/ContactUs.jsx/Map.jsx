import React, { useState } from "react";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    company: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully ✅\n" + JSON.stringify(formData, null, 2));
  };

  return (
    <section className="bg-white py-16">
      <div className="container grid md:grid-cols-2 gap-10 items-stretch">
        {/* Left: Contact Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 bg-white p-6 rounded-xl shadow-md border border-green-200 h-full flex flex-col justify-between"
        >
          {/* Row 1: Name + Mobile */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 2: Email + City */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="company"
              required
              value={formData.company}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-900 focus:outline-none"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-green-900 hover:bg-green-800 text-white font-semibold px-6 py-2 rounded-full shadow-md transition"
          >
            SUBMIT
          </button>
        </form>

        {/* Right: Contact Info Cards */}
        <div className="grid gap-6 h-full">
          {/* Address Card */}
          <a
            href="https://www.google.com/maps/place/Palam+Vihar,+Gurgaon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-white border border-green-900 shadow-md rounded-2xl p-8 text-center transition transform hover:-translate-y-2 hover:shadow-lg cursor-pointer flex flex-col justify-center h-full"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-900 p-4 rounded-full text-white">
                <MapPin size={32} />
              </div>
            </div>
            <p className="text-gray-700 text-sm md:text-base">
              T6/1105, Park View Residency, Palam Vihar, Gurgaon 122017, Haryana,
              India
            </p>
          </a>

          {/* Phone Card */}
          <a
            href="tel:+919999252341"
            className="flex-1 bg-white border border-green-900 shadow-md rounded-2xl p-8 text-center transition transform hover:-translate-y-2 hover:shadow-lg cursor-pointer flex flex-col justify-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-900 p-4 rounded-full text-white">
                <Phone size={32} />
              </div>
            </div>
            <p className="text-green-900 font-semibold text-sm md:text-base">
              +91 9999252341, 9560410594
            </p>
          </a>

          {/* Email Card */}
          <a
            href="mailto:info@nirgandh.com"
            className="flex-1 bg-white border border-green-900 shadow-md rounded-2xl p-8 text-center transition transform hover:-translate-y-2 hover:shadow-lg cursor-pointer flex flex-col justify-center"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-green-900 p-4 rounded-full text-white">
                <Mail size={32} />
              </div>
            </div>
            <p className="text-green-900 font-semibold text-sm md:text-base">
              info@nirgandh.com
            </p>
          </a>
        </div>
      </div>

      {/* Bottom: Google Map Full Width */}
      <div className="mt-16 w-full h-[450px]">
        <iframe
          title="Nirgandh Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.303188384917!2d77.03775607495887!3d28.56153557570914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d193cd5c35e13%3A0xb1c67b9d99dd3f3!2sNirgandh!5e0!3m2!1sen!2sin!4v1695134465152!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
