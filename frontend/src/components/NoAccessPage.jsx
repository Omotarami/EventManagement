/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaEye, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const NoAccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use the login function from AuthContext to handle authentication
      const user = await login(formData.email, formData.password);

      toast.success("Login successful!");

      // Redirect based on user role
      if (user.role === "organizer") {
        navigate("/organizer-dashboard");
      } else if (user.role === "attendee") {
        navigate("/attendee-dashboard");
      } else {
        const from = location.state?.from?.pathname || "/organizer-dashboard";
        navigate(from);
      }
    } catch (error) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col items-center justify-center p-4">
      {!showLoginForm ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg w-full"
        >
          {/* Animated Lock Character */}
          <motion.div
            className="mb-8 relative"
            animate={{
              rotate: [-5, 5, -5],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <div className="w-32 h-32 mx-auto bg-orange-100 rounded-full flex items-center justify-center">
              <FaLock size={50} color="#F97316" />
              <motion.div
                className="absolute -bottom-1 -right-1 bg-red-500 rounded-full w-10 h-10 flex items-center justify-center"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <span className="text-white text-lg font-bold">!</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Playful Warning Message */}
          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Whoa there, adventurer!
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            This area is locked tighter than a treasure chest! 🔒
            <br />
            You need to be logged in to access this mysterious dashboard.
          </motion.p>

          {/* Floating emojis */}
          <div className="relative h-16">
            <motion.span
              className="absolute text-3xl"
              style={{ left: "20%", top: "0" }}
              animate={{
                y: [0, -20, 0],
                x: [-5, 5, -5],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🔐
            </motion.span>
            <motion.span
              className="absolute text-3xl"
              style={{ left: "50%", top: "20%" }}
              animate={{
                y: [0, -15, 0],
                x: [0, 10, 0],
              }}
              transition={{ duration: 4, repeat: Infinity, delay: 0.5 }}
            >
              🚫
            </motion.span>
            <motion.span
              className="absolute text-3xl"
              style={{ left: "80%", top: "10%" }}
              animate={{
                y: [0, -25, 0],
                x: [5, -5, 5],
              }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            >
              🛡️
            </motion.span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLoginForm(true)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium shadow-md hover:bg-orange-600 transition-colors"
            >
              Log in to access
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Return to safety
            </motion.button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
              Welcome Back!
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaEnvelope className="text-black" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block mb-1 text-sm font-medium text-black"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FaLock className="text-black" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none text-black focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-black " />
                    ) : (
                      <FaEye className="text-black " />
                    )}
                  </div>
                </div>
              </div>

              {/* Helper text for testing */}
              <div className="text-sm text-gray-500">
                <p>
                  Hint: Use an email with "organizer" to login as an organizer.
                </p>
                <p>Example: organizer@example.com / anypassword</p>
              </div>

              {/* Login Button */}
              <motion.button
                type="submit"
                className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium cursor-pointer rounded-lg shadow transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign in
              </motion.button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowLoginForm(false)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Back to warning
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NoAccessPage;
