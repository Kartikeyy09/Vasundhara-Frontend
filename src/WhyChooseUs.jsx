 export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white">
      {/* ✅ Tailwind container use kiya */}
      <div className="container flex flex-col md:flex-row items-center gap-12">
        
        {/* Left Section - Video */}
        <div className="w-full md:w-1/2">
          <video
            controls
            className="w-full h-64 md:h-[22rem] object-cover rounded-lg shadow-lg"
          >
            <source
              src="https://www.w3schools.com/html/mov_bbb.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Right Section - Text */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-800 leading-relaxed mb-8">
              We aim to provide security, comfort, and safety during defecation,
              motivate the use of in-house toilets with our high-quality products.
              These eco-friendly toilets are easy to install, use, and maintain
              and require minimal water consumption.motivate the use of in-house toilets with our high-quality products.
              These eco-friendly toilets are easy to install, use, and maintain
              and require minimal water consumption.
            </p>

            <h2 className="text-3xl md:text-4xl font-bold text-green-800 mb-4">
              Our Philosophy
            </h2>
            <p className="text-gray-800 leading-relaxed">
              We believe in delivering high-quality, sustainable and affordable
              WASH solutions with complete honesty. Our organization believes in
              innovating and embracing new technology to evolve, learn and make a
              positive difference in society by providing clean and hygienic
              sanitation solutions to one and all.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
