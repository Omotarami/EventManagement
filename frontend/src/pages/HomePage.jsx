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
        <div className="flex justify-between p-6 max-w-5xl mx-auto">
          <h1 className="text-xl font-bold">
            <span className=" text-teal-600">EVEN</span>
            <span className="text-orange-300">TRO</span>
          </h1>
          <nav className=" flex space-x-8 ml-auto text-sm ">
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
        <section>
          <div className=" absolute inset-0 max-w-5xl mx-auto p-6 py-60 font-light">
            <h2 className="text-4xl font-medium">
              Discover <span className="font-bold text-teal-600">Events</span>
              Around You
            </h2>
            <p>Book tickets for concerts,tech events, fashion and more</p>
          </div>
          <div className="absolute inset-0  m-40 pt-40 font-light ml-190">
            <h2 className="text-4xl font-medium">
              Plan Your Next
              <span className="font-bold text-orange-300">Event</span>
            </h2>
            <p>
              Plan events with vendors, create tickets and sell the experience
            </p>
          </div>
        </section>
        </div>
        </div>
      <div></div>
    </>
  );
};

export default HomePage;
