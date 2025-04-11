const HomePage = () => {
  return (
    <>
      <div>
        <div>
          <img
            className="h-screen w-full"
            src="../public/images/bg.png"
            alt=""
          />
          <div className="absolute inset-0 opacity-60  bg-black"></div>
          <header>
            <h1 className="absolute inset-0 text-xl font-bold m-15">
              <span className=" text-teal-600">EVEN</span>
              <span className="text-orange-300">TRO</span>
            </h1>
            <nav>
              <a href="#" className="absolute inset-0 m-15 pl-140">
                PLAN EVENTS
              </a>
              <a href="#" className="absolute inset-0 m-15 pl-180">
                ATTEND EVENTS
              </a>
              <a href="#" className="absolute inset-0 m-15 pl-225">
                LOG IN
              </a>
              <a href="#" className="absolute inset-0 m-15 pl-255">
                SIGN UP
              </a>
            </nav>
          </header>
          <section className="absolute inset-0 m-70">Discover Events Around You</section>
        </div>
      </div>
      <div></div>
    </>
  );
};

export default HomePage;
