/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import Categories from '../components/Home/Categories';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />
      
      {/* Animated divider */}
      <div className="relative max-w-7xl mx-auto my-12 px-4">
        <div className="h-0.5 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full w-1/3 bg-gradient-to-r from-teal-500 to-orange-300"
            initial={{ x: '-100%' }}
            animate={{ x: '300%' }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;