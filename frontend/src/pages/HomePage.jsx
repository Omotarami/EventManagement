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
            <div className="flex justify-between px-3 max-w-6xl mx-auto">
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
          <section className="absolute inset-0 flex justify-between max-w-6xl mx-auto px-3">
            <div className="py-50 ">
              <h2 className="text-4xl font-normal">
                Discover{" "}
                <span className="font-bold text-teal-600">Events </span>
                Around You
              </h2>
              <p className="font-light">
                Book tickets for concerts,tech events, fashion and more
              </p>
              <div className="flex space-x-1 ">
                <div className="bg-white rounded-lg p-1.5">
                  <input
                    type="text"
                    placeholder="Search for events"
                    className="w-65 text-black outline-0"
                  ></input>
                </div>
                <div className="flex bg-white p-2 rounded-lg items-center ">
                  <input
                    type="text"
                    placeholder="Choose a location"
                    className=" w-40 text-black outline-none"
                  ></input>
                  <img
                    src="../public/icons/location.svg"
                    alt=""
                    className="w-5 h-5 "
                  />
                </div>
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
              <div className="flex justify-end gap-1 text-start font-semibold ">
                <div className=" p-2 rounded-lg inline-flex bg-white items-center">
                  <p className=" w-25 text-orange-300">Get started</p>
                  <img
                    src="../public/icons/arrow.svg"
                    className="w-5 h-5"
                  ></img>
                </div>
                <div className="p-2 bg-orange-300 rounded-lg">
                  <p className="  w-20 text-white">Lean more</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="px-3 max-w-6xl mx-auto py-10">
        <div className=" flex justify-between">
        <p className="text-sm text-black  "> Explore Categories</p>
        {/* <div className=" underline w-7 h-1 rounded-2xl  bg-black "></div> */}
        <img src="../public/icons/arrow.svg" className=""></img>
        </div>
        <div className="overflow-x-auto">
          <div className="flex justify-between mt-6  ">
            <div className="flex flex-col items-center">
              <span className="h-20 w-20 bg-slate-300 rounded-full flex items-center justify-center">
                <img
                  src="../public/icons/Sci&Tech.svg"
                  alt="tech"
                  className="w-6 h-6"
                />
              </span>
              <p className="text-black text-center text-xs pt-4">
                Science & Technology
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-20 w-20 bg-slate-300 rounded-full flex items-center justify-center">
                <img
                  src="../public/icons/Sci&Tech.svg"
                  alt="tech"
                  className="w-6 h-6"
                />
              </span>
              <p className="text-black text-center text-xs pt-4">Business</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-20 w-20 bg-slate-300 rounded-full flex items-center justify-center">
                <img
                  src="../public/icons/Sci&Tech.svg"
                  alt="tech"
                  className="w-6 h-6"
                />
              </span>
              <p className="text-black text-center text-xs pt-4">Fashion</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-20 w-20 bg-slate-300 rounded-full flex items-center justify-center">
                <img
                  src="../public/icons/Sci&Tech.svg"
                  alt="tech"
                  className="w-6 h-6"
                />
              </span>
              <p className="text-black text-center text-xs pt-4">Concerts</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-20 w-20 bg-slate-300 rounded-full flex items-center justify-center">
                <img
                  src="../public/icons/Sci&Tech.svg"
                  alt="tech"
                  className="w-6 h-6"
                />
              </span>
              <p className="text-black text-center text-xs pt-4">
                Spirituality
              </p>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-20 w-20 bg-slate-300 rounded-full flex items-center justify-center">
                <img
                  src="../public/icons/Sci&Tech.svg"
                  alt="tech"
                  className="w-6 h-6"
                />
              </span>
              <p className="text-black text-center text-xs pt-4">Liesure</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-20 w-20 bg-slate-300 rounded-full flex items-center justify-center">
                <img
                  src="../public/icons/Sci&Tech.svg"
                  alt="tech"
                  className="w-6 h-6"
                />
              </span>
              <p className="text-black text-center text-xs pt-4">Culture</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="h-20 w-20 bg-slate-300 rounded-full flex items-center justify-center">
                <img
                  src="../public/icons/Sci&Tech.svg"
                  alt="tech"
                  className="w-6 h-6"
                />
              </span>
              <p className="text-black text-center text-xs pt-4">Sports</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
