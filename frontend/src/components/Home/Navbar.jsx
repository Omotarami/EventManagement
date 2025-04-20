/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="absolute top-0 left-0 w-full z-10 py-6">
      <div className="flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto">
        <motion.h1 
          className="text-2xl font-bold"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-teal-500">EVEN</span>
          <span className="text-orange-300">TRO</span>
        </motion.h1>
        
      
        <nav className="hidden md:flex space-x-8 ml-auto">
          <a href="#" className="group relative text-white hover:text-orange-300 transition-colors duration-300 text-sm tracking-wide">
            PLAN EVENTS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="group relative text-white hover:text-orange-300 transition-colors duration-300 text-sm tracking-wide">
            ATTEND EVENTS
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="group relative text-white hover:text-orange-300 transition-colors duration-300 text-sm tracking-wide">
            LOG IN
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300"></span>
          </a>
          <a href="#" className="group relative text-white hover:text-orange-300 transition-colors duration-300 text-sm tracking-wide">
            SIGN UP
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-300 group-hover:w-full transition-all duration-300"></span>
          </a>
        </nav>
        
       
        <button
          className="md:hidden text-white hover:text-orange-300 transition-colors duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            className="w-6 h-6"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        
        
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-black bg-opacity-90 md:hidden">
            <div className="flex flex-col p-4 space-y-4">
              <a href="#" className="text-white hover:text-orange-300 transition-colors py-2 border-b border-gray-800">
                PLAN EVENTS
              </a>
              <a href="#" className="text-white hover:text-orange-300 transition-colors py-2 border-b border-gray-800">
                ATTEND EVENTS
              </a>
              <a href="#" className="text-white hover:text-orange-300 transition-colors py-2 border-b border-gray-800">
                LOG IN
              </a>
              <a href="#" className="text-white hover:text-orange-300 transition-colors py-2 border-b border-gray-800">
                SIGN UP
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;