import PropTypes from "prop-types";

const Cards = () => {
  return (
    <>
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex space-x-6 mb-8 text-black">
          <p>All</p>
          <p>Today</p>
          <p>Events</p>
          <p>Weekends</p>
          <p>Online</p>
          <p>Free</p>
        </div>
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
                Discover exciting events near you and secure your tickets in
                just a few clicks. Browse by category, location, or interest,
                and get instant access to the best experiences. With Eventro,
                finding and attending events has never been easier!
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
                Easily create and manage events while selling tickets
                seamlessly. Customize ticket types, set pricing, and promote
                your event to a wider audience. Eventro simplifies the process,
                making event hosting effortless.
              </p>
            </div>
          </div>
        </div>
        <div className=" flex flex-col justify-items-center items-center mt-10 space-y-3">
          <h1 className=" text-3xl text-black font-medium">
            Ready to experience Eventro?
          </h1>
          <p className="text-black text-center max-w-xl">
            Discover, connect, and engage with events. Business conferences,
            tech meetups to exclusive concerts, we connect you to the best.
          </p>
        </div>
        <footer></footer>
      </section>
    </>
  );
};

export default Cards;
