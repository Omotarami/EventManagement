/* eslint-disable no-unused-vars */
import { motion } from 'framer-motion';
import Navbar from '../components/Home/Navbar';
import Hero from '../components/Home/Hero';
import Categories from '../components/Home/Categories';
import Cards from "../components/Home/Cards";

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Categories />

      
      {/* Animated divider */}
        <div className="h-15.5 bg-none outline-1 outline-black">
      </div>
      <Cards/>
    </div>
  );
};

export default HomePage;