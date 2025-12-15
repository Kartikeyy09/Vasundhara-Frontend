import React from "react";
import HeroSection from "../HeroSection";
import OurPresence from "../OurPresence";
import AnimatedImage from "../AboutHome";
import WhyChooseUs from "../WhyChooseUs";
import WhoWeWorkWith from "../WhoWeWorkWith";
import AboutHome from "../AboutHome";

export default function Home() {
  return (
    <>
      <HeroSection />
      <OurPresence />
      {/* <AnimatedImage /> */}
      <AboutHome />
      <WhyChooseUs />
      <WhoWeWorkWith />
    </>
  );
}
