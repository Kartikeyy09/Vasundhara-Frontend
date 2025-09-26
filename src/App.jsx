import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Government from "./OurWork/Government";
import MunicipalCorporation from "./OurWork/MunicipalCorporation";
import BusStand from "./OurWork/BusStand";
import Railway from "./OurWork/Railway";
import VisionMission from "./About/VisionMission";
import Team from "./About/Team";
import ContactUs from "./Pages/ContactUs";






const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/about", element: <About /> },
      { path: "/government", element: <Government /> },
      {path: "/municipal-corporation", element: <MunicipalCorporation />},
      {path: "/bus-stand", element: <BusStand />},
      {path: "/railway", element: <Railway />},
      {path: "/vision-mission", element: <VisionMission />},
      {path: "/team", element: <Team />},
      {path: "/contact-us", element: <ContactUs />},
     
     
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
