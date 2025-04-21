/* eslint-disable no-unused-vars */
import {motion} from "framer-motion";
import Navbar from "../components/Home/Navbar";
import Hero from "../components/Home/Hero";
import Categories from "../components/Home/Categories";
import Cards from "../components/Home/Cards";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />

      {/* Animated divider */}
      <div className="h-15.5 bg-none outline-1 outline-black"></div>
      <Cards />
      <div className="flex space-x-10 justify-center w-full ">
        <div className="bg-teal-100 w-130 h-50 rounded-lg  pt-12 pl-5">
          <div className="flex items-baseline space-x-3 space-y-3">
            <img src="../public/icons/buy.svg" alt="buy" className="w-7" />
            <h3 className=" font-medium text-3xl text-black">
              {" "}
              Buy Tickets and Explore
            </h3>
          </div>
          <div>
            <p className="text-xs text-black">
              Discover exciting events near you and secure your tickets in just
              a few clicks. Browse by category, location, or interest, and get
              instant access to the best experiences. With Eventro, finding and
              attending events has never been easier!
            </p>
          </div>
        </div>
        <div className="bg-orange-100 w-130 h-50 rounded-lg  pt-12 pl-5">
          <div className="flex items-baseline space-x-3 space-y-3">
            <img src="../public/icons/host.svg" alt="buy" className="w-7" />
            <h3 className=" font-medium text-3xl text-black">
              {" "}
              Buy Tickets and Explore
            </h3>
          </div>
          <div>
            <p className="text-xs text-black">
              Easily create and manage events while selling tickets seamlessly.
              Customize ticket types, set pricing, and promote your event to a
              wider audience. Eventro simplifies the process, making event
              hosting effortless.
            </p>
          </div>
        </div>
      </div>
      <div className=" flex flex-col justify-items-center items-center mt-10 space-y-5">
        <h1 className=" text-3xl text-black font-medium">
          Ready to experience Eventro?
        </h1>
        <p className="text-black text-center max-w-xl">
          Discover, connect, and engage with events. Business conferences, tech
          meetups to exclusive concerts, we connect you to the best.
        </p>
        <div className="">
          <button className="outline-1 w-sm bg-none outline-black rounded-lg mb-5 p-2 text-black">
            Get Started
          </button>
        </div>
      </div>
      <footer className="bg-"></footer>
    </div>
  );
};

export default HomePage;
