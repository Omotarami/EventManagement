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

        <div className="flex items-center">
          <div className="absolute justify-items-center"></div>
          <div className=" bg-white shadow-md w-70 h-70 rounded-lg pt-4 ">
            <div className="bg-gray-300 h-30 w-50 rounded-lg outline-none">
              <img src="sj" alt="event image"/>
              <div className="flex bg-slate-400 opacity-40 text-black  w-40 p-1 rounded-lg bottom-5">
                <img src="../public/icons/location.svg" alt="" />
              <p>Anywhere street</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cards;
