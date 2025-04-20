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
        <div className="flex space-x-6 justify-between w-1/4 h-60 rounded-lg border-1">
          <div className=" flex flex-col w-80  items-center mt-3">
            <img src="#" alt="event image" className="bg-slate-600 w-60 h-30 rounded-lg"></img>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cards;
