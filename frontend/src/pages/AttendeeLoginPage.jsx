/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaTicketAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AttendeeLoginPage = () => {
  const navigate = useNavigate();
  const { loginAsAttendee } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await loginAsAttendee(formData.email, formData.password);
      toast.success("Login successful!");
      navigate("/attendee-dashboard");
    } catch (error) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left side - Animated Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-400 to-orange-500 p-12 justify-center items-center overflow-hidden relative">
        {/* Background animated circles/bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white opacity-10"
              style={{
                width: Math.random() * 100 + 50,
                height: Math.random() * 100 + 50,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 5 + Math.random() * 10,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        {/* Main animated illustration */}
        <div className="relative z-10 w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-white text-center"
          >
            <motion.h1
              className="text-4xl font-bold mb-6"
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              Join Events on Even<span style={{ color: "#2A9D8F" }}>tro</span>
            </motion.h1>

            {/* Ticket illustration */}
            <motion.div
              className="w-full h-64 my-8 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <motion.div
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                animate={{
                  rotate: [-2, 2, -2],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <svg
                  width="240"
                  height="160"
                  viewBox="0 0 240 160"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Ticket base */}
                  <motion.path
                    d="M20 40 H180 C180 40, 190 40, 190 50 V110 C190 110, 190 120, 180 120 H20 C20 120, 10 120, 10 110 V50 C10 50, 10 40, 20 40 Z"
                    fill="rgba(255,255,255,0.15)"
                    stroke="white"
                    strokeWidth="3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />

                  {/* Ticket perforation */}
                  <motion.path
                    d="M150 40 V120"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray="6 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />

                  {/* Event details on ticket */}
                  <motion.rect
                    x="30"
                    y="60"
                    width="80"
                    height="8"
                    fill="white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                  />

                  <motion.rect
                    x="30"
                    y="80"
                    width="100"
                    height="8"
                    fill="white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 1.7 }}
                  />

                  <motion.rect
                    x="30"
                    y="100"
                    width="60"
                    height="8"
                    fill="white"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 1.9 }}
                  />

                  {/* Ticket code */}
                  <motion.rect
                    x="160"
                    y="70"
                    width="20"
                    height="20"
                    fill="#2A9D8F"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 2.1 }}
                  />
                </svg>
              </motion.div>

              {/* Floating icons */}
              <motion.div
                className="absolute top-0 right-12"
                animate={{
                  y: [0, -15, 0],
                  rotate: [-5, 5, -5],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FaTicketAlt size={40} color="#2A9D8F" />
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-12"
                animate={{
                  y: [0, 10, 0],
                  rotate: [5, -5, 5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1,
                }}
              >
                <FaCalendarAlt size={34} color="white" />
              </motion.div>
            </motion.div>

            <motion.p
              className="text-lg mt-4 opacity-90"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Login to discover amazing events near you
            </motion.p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          className="w-full max-w-md"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo for mobile view */}
          <motion.div
            variants={itemVariants}
            className="lg:hidden text-center mb-8"
          >
            <h1 className="text-3xl font-bold">
              Even<span style={{ color: "#F4A261" }}>tro</span>
            </h1>
            <p className="text-gray-600 mt-2">Where experiences come to life</p>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">
              Attendee Login
            </h2>
            <p className="text-gray-600 mt-2">
              Sign in to find and attend amazing events
            </p>
          </motion.div>

          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaEnvelope className="text-gray-500" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                  required
                />
              </div>
            </div>

            {/* Password Field with Toggle */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm font-medium text-orange-600 hover:text-orange-500"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <FaLock className="text-gray-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-black"
                  required
                />
                <div
                  className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-500 hover:text-gray-700" />
                  ) : (
                    <FaEye className="text-gray-500 hover:text-gray-700" />
                  )}
                </div>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Attendee Sign In"}
            </motion.button>
          </motion.form>

          {/* Switch to Organizer Login */}
          <motion.div variants={itemVariants} className="text-center mt-4">
            <Link
              to="/login/organizer"
              className="text-sm font-medium text-orange-600 hover:text-orange-500"
            >
              Switch to Organizer Login
            </Link>
          </motion.div>

          {/* Sign Up Link */}
          <motion.p variants={itemVariants} className="text-center mt-8">
            <span className="text-gray-600">Don't have an account?</span>
            <Link
              to="/signup/attendee"
              className="ml-1 font-medium text-orange-600 hover:text-orange-500"
            >
              Sign up as Attendee
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default AttendeeLoginPage;