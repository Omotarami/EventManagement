/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UnderConstruction = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-xl w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Fun Construction Icon */}
          <motion.div
            className="mx-auto"
            animate={{
              rotate: [0, 10, -10, 10, 0],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 5,
            }}
          >
            <div className="relative h-40 w-40 mx-auto">
              <motion.div
                className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-orange-400 rounded-full z-10"
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3 w-24 h-3 bg-orange-300 rounded-full opacity-60"></div>
                <div className="absolute top-5 left-4 w-4 h-4 bg-white rounded-full"></div>
                <div className="absolute top-5 right-4 w-4 h-4 bg-white rounded-full"></div>
                <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-white rounded-full"></div>
              </motion.div>
              <motion.div
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-20 bg-yellow-500 rounded-t-full"
                animate={{ rotate: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-yellow-600"></div>
              </motion.div>
            </div>
          </motion.div>

          {/* 404 Text */}
          <motion.h1
            className="text-7xl font-bold text-orange-500"
            animate={{
              scale: [1, 1.05, 1],
              color: ["#f97316", "#fb923c", "#f97316"],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 2,
            }}
          >
            404
          </motion.h1>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-2">
              Oops! This Page is Under Construction
            </h2>
            <p className="text-gray-600 mb-6">
              Our tiny cartoon builders are working day and night to bring this
              amazing feature to life! Check back soon for all the fun!
            </p>

            {/* Tools Animation */}
            <div className="flex justify-center gap-8 mb-8">
              <motion.div
                animate={{
                  rotate: [0, 15, 0],
                  y: [0, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                  delay: 0.2,
                }}
                className="text-3xl"
              >
                🔨
              </motion.div>
              <motion.div
                animate={{
                  rotate: [0, -15, 0],
                  y: [0, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                  delay: 0.5,
                }}
                className="text-3xl"
              >
                🔧
              </motion.div>
              <motion.div
                animate={{
                  rotate: [0, 15, 0],
                  y: [0, -5, 0],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 1.5,
                  delay: 0.8,
                }}
                className="text-3xl"
              >
                🧰
              </motion.div>
            </div>

            <Link to="/organizer-dashboard">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full shadow-lg cursor-pointer transition duration-300"
              >
                Back to Dashboard
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnderConstruction;
