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
        <div class="w-full max-w-sm bg-white rounded-xl shadow-md overflow-hidden">
   {/*Rounded top background section*/}
  <div class="relative h-40 bg-blue-500 rounded-lg bg-cover bg-center">
    
    {/* Location pill */}
    <div class="absolute top-3 left-3 bg-white/80 text-xs text-gray-700 px-3 py-1 rounded-full shadow-sm flex items-center space-x-1">
</div>         
          </div>
        </div>
      </section>
    </>
  );
};

export default Cards;
