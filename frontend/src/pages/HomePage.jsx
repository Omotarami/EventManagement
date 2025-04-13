import {MapPin} from "lucide-react";
const HomePage = () => {
  return (
    <>
      <div>
        <div className="relative">
          <img
            className=" h-screen w-full object-cover"
            src="../public/images/bg.png"
            alt=""
          />
          <div className="absolute inset-0 opacity-60 bg-black "></div>
          <header className="absolute top-10 left-0 w-full">
            <div className="flex justify-between px-5 max-w-5xl mx-auto">
              <h1 className="text-xl font-bold">
                <span className=" text-teal-600">EVEN</span>
                <span className="text-orange-300">TRO</span>
              </h1>
              <nav className=" flex space-x-8 ml-auto text-sm">
                <a href="#" className="">
                  PLAN EVENTS
                </a>
                <a href="#" className="">
                  ATTEND EVENTS
                </a>
                <a href="#" className="">
                  LOG IN
                </a>
                <a href="#" className="">
                  SIGN UP
                </a>
              </nav>
            </div>
          </header>
          <section className="absolute inset-0 flex justify-between max-w-5xl mx-auto px-5">
            <div className="py-50 ">
              <h2 className="text-4xl font-normal">
                Discover{" "}
                <span className="font-bold text-teal-600">Events </span>
                Around You
              </h2>
              <p className="font-light">
                Book tickets for concerts,tech events, fashion and more
              </p>
              <div>
                <input
                  type="text"
                  placeholder="Search for events"
                  className="bg-white rounded-lg p-1.5 w-65 text-black bg"
                ></input>
                <input
                  type="text"
                  placeholder="Choose a location"
                  className=" bg-white rounded-lg p-1.5 w-40 text-black mx-0.5"
                ></input>
              </div>
            </div>
            <div className="font-light ml-auto pt-70 text-right">
              <h2 className="text-4xl font-normal">
                Plan Your Next
                <span className="font-bold text-orange-300"> Event</span>
              </h2>
              <p>
                Plan events with vendors, create tickets and sell the experience
              </p>
              <div className="flex justify-end gap-1 text-start font-semibold">
                <p className="bg-white rounded-lg p-1.5 w-35 text-orange-300">
                  Get started
                </p>
                <p className=" bg-orange-300 rounded-lg p-1.5 w-25 text-white">
                  Lean more
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="">

      </div>

      <div></div>
    </>
  );
};

export default HomePage;
