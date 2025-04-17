/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          className="h-screen w-full object-cover"
          src="/images/bg.png"
          alt="Event background"
        />
        <div className="absolute inset-0 bg-black opacity-70"></div>
      </div>
      
      {/* Content Container */}
      <div className="absolute inset-0 flex md:flex-row justify-between items-center max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-0">
        {/* Discover Events Section */}
        <div className="md:w-1/2 z-10 space-y-6 md:pr-8">
          <h2 className="text-3xl md:text-5xl font-normal text-white">
            Discover{" "}
            <span className="font-bold text-teal-500">Events </span>
            Around You
          </h2>
          
          <p className="font-light text-white md:text-lg">
            Book tickets for concerts, tech events, fashion and more
          </p>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="bg-white rounded-lg p-3 flex items-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              <input
                type="text"
                placeholder="Search for events"
                className="w-full text-black outline-none"
              />
              <button className="ml-2 hover:text-teal-500 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            <div className="flex items-center bg-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
              <input
                type="text"
                placeholder="Choose a location"
                className="w-full text-black outline-none"
              />
              <span className="text-orange-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
        
        {/* Diagonal Line using  */}
        <motion.div 
          className="hidden md:block absolute left-1/2 h-3/4 w-0.5 bg-white 1"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 0.6, height: '75%' }}
          transition={{ duration: 1 }}
          style={{ transform: 'translateX(-50%) rotate(45deg)', transformOrigin: 'center' }}
        />
        
        {/* Plan Your Event Section */}
        <div className="md:w-1/2 z-10 space-y-6 md:pl-8 text-right mt-10 md:mt-0">
          <h2 className="text-3xl md:text-5xl font-normal text-white">
            Plan Your Next
            <span className="font-bold text-orange-300"> Event</span>
          </h2>
          
          <p className="font-light text-white md:text-lg">
            Plan events with vendors, create tickets and sell the experience
          </p>
          
          <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3">
            <div className="flex items-center justify-center space-x-2 bg-white rounded-lg py-3 px-6 shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer group">
              <span className="text-orange-400 font-semibold">Get started</span>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-orange-400" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </div>
            
            <button className="bg-orange-400 rounded-lg py-3 px-6 text-white font-semibold shadow-lg hover:bg-orange-500 transition-colors duration-300">
              Learn more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;