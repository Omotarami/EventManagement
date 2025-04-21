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
      <footer className="relative ">
        <div className="absolute grid">
          <img
            src="../public/images/footer.png"
            alt=""
            className=" object-cover inset-0"
          />
          <div className="absolute inset-0 bg-white opacity-70"></div>
          <div className="absolute inset-0 bg-black opacity-80"></div>
        </div>
        <div className=" relative  md:px-6 text-white  ">
          <div className="flex justify-between pt-10 text-xl font-bold">
            <div className=" flex flex-col">
              <p>Eventro</p>
              <div className=" flex flex-col pt-10  text-sm font-light ">
                <a href="#" className="flex items-center ">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>

                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
              </div>
            </div>
            <div className="flex-col ">
              <p>For Attendees</p>
              <div className="flex flex-col pt-10 text-sm font-light">
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>

                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
              </div>
            </div>
            <div className="flex-col ">
              <p>For Organisers</p>
              <div className="flex flex-col pt-10 text-sm font-light">
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>

                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
              </div>
            </div>
            <div className="flex-col ">
              <p>Legal</p>
              <div className="flex flex-col pt-10 text-sm font-light">
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>

                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
                <a href="#" className="flex items-center">
                  <img src="../public/icons/footerarr.svg" alt="" />
                  About us
                </a>
              </div>
            </div>
          </div>
          <div className="flex py-10 items-center justify-between">
            <div className="flex items-center">
              <img src="../public/icons/footerarr.svg" alt="" />
              <div className="flex space-x-2">
                <a href="" className="">
                  <img src="../public/icons/instagram.svg" alt="" />{" "}
                </a>
                <a href="">
                  <img src="../public/icons/facebook.svg" alt="" />
                </a>
                <a href="">
                  <img src="../public/icons/twitter.svg" alt="" />
                </a>
              </div>
            </div>

            <div className=" transform: translate-5 rotate-[-15deg] ">
              <h1 style={{ fontFamily:'"Gideon Roman",cursive'}} className="text-8xl">Even<span className="text-orange-300">tro</span></h1>
            </div>
            <div>
              <p>&copy;Copyright Policy</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
