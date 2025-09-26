import React from "react";

export default function Ethics() {
  return (
    <section className="bg-[#f7fcf5] py-16">
      <div className="container grid md:grid-cols-2 gap-10 items-center">
        {/* Left Content */}
        <div>
          <h3 className="text-xl font-semibold text-green-900 mb-2">
            Bhumi Care
          </h3>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-snug">
            Ethics <span className="text-green-900">Committee</span>
          </h1>
          <p className="text-gray-700 leading-relaxed mb-8 text-base md:text-lg">
            The Ethics committee at Bhumi addresses ethical issues. All Physical
            / Mental / Emotional / Sexual Harassment of: Bhumians including
            Volunteers and Employees, complaints will have to be reported to the
            POSH committee. Please note: Confidentiality is guaranteed and your
            information is protected at all times. To help us take appropriate
            actions within a short time, we urge you to whenever available and
            possible please provide detailed information (including proof) share
            your name and contact details to contact you if more details are
            required related to the incident.
          </p>

          
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src="https://blog.ethicsglobal.com/wp-content/uploads/2023/05/what-is-an-ethics-committee.jpg"
            alt="Ethics Committee"
            className="w-full max-w-lg object-cover rounded-xl shadow-md"
          />
        </div>
      </div>
    </section>
  );
}
