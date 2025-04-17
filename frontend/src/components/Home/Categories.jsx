/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';

const Categories = () => {
  return (
    <section className="py-16 px-4 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="relative">
          <h3 className="text-xl font-semibold text-black">Explore Categories</h3>
          <div className="w-24 h-1 bg-teal-500 rounded-full mt-2" />
        </div>
        
        <button className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-6 md:space-x-8 lg:space-x-12 min-w-max">
          {/* Science & Technology */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md group-hover:bg-teal-50 transition-colors duration-300 hover:scale-105">
              <img
                src="/icons/Sci&Tech.svg"
                alt="Science & Technology"
                className="w-8 h-8"
              />
            </div>
            <p className="text-black text-center text-sm font-medium mt-3 group-hover:text-teal-600 transition-colors duration-300">
              Science & Technology
            </p>
          </div>
          
          {/* Business */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md group-hover:bg-teal-50 transition-colors duration-300 hover:scale-105">
              <img
                src="/icons/Sci&Tech.svg"
                alt="Business"
                className="w-8 h-8"
              />
            </div>
            <p className="text-black text-center text-sm font-medium mt-3 group-hover:text-teal-600 transition-colors duration-300">
              Business
            </p>
          </div>
          
          {/* Fashion */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md group-hover:bg-teal-50 transition-colors duration-300 hover:scale-105">
              <img
                src="/icons/Sci&Tech.svg"
                alt="Fashion"
                className="w-8 h-8"
              />
            </div>
            <p className="text-black text-center text-sm font-medium mt-3 group-hover:text-teal-600 transition-colors duration-300">
              Fashion
            </p>
          </div>
          
          {/* Concerts */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md group-hover:bg-teal-50 transition-colors duration-300 hover:scale-105">
              <img
                src="/icons/Sci&Tech.svg"
                alt="Concerts"
                className="w-8 h-8"
              />
            </div>
            <p className="text-black text-center text-sm font-medium mt-3 group-hover:text-teal-600 transition-colors duration-300">
              Concerts
            </p>
          </div>
          
          {/* Spirituality */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md group-hover:bg-teal-50 transition-colors duration-300 hover:scale-105">
              <img
                src="/icons/Sci&Tech.svg"
                alt="Spirituality"
                className="w-8 h-8"
              />
            </div>
            <p className="text-black text-center text-sm font-medium mt-3 group-hover:text-teal-600 transition-colors duration-300">
              Spirituality
            </p>
          </div>
          
          {/* Leisure */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md group-hover:bg-teal-50 transition-colors duration-300 hover:scale-105">
              <img
                src="/icons/Sci&Tech.svg"
                alt="Leisure"
                className="w-8 h-8"
              />
            </div>
            <p className="text-black text-center text-sm font-medium mt-3 group-hover:text-teal-600 transition-colors duration-300">
              Leisure
            </p>
          </div>
          
          {/* Culture */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md group-hover:bg-teal-50 transition-colors duration-300 hover:scale-105">
              <img
                src="/icons/Sci&Tech.svg"
                alt="Culture"
                className="w-8 h-8"
              />
            </div>
            <p className="text-black text-center text-sm font-medium mt-3 group-hover:text-teal-600 transition-colors duration-300">
              Culture
            </p>
          </div>
          
          {/* Sports */}
          <div className="flex flex-col items-center cursor-pointer group">
            <div className="h-20 w-20 bg-gray-200 rounded-full flex items-center justify-center shadow-md group-hover:bg-teal-50 transition-colors duration-300 hover:scale-105">
              <img
                src="/icons/Sci&Tech.svg"
                alt="Sports"
                className="w-8 h-8"
              />
            </div>
            <p className="text-black text-center text-sm font-medium mt-3 group-hover:text-teal-600 transition-colors duration-300">
              Sports
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Categories;