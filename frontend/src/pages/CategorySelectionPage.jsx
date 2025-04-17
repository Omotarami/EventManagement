// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  GraduationCap, 
  Sparkles, 
  Music, 
  Dumbbell, 
  Heart, 
  Laptop, 
  Plane 
} from 'lucide-react';

const CategorySelectionPage = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  
  
  const categories = [
    { id: 'business', name: 'Business', icon: Briefcase },
    { id: 'educational', name: 'Educational', icon: GraduationCap },
    { id: 'fashion', name: 'Fashion and Lifestyle', icon: Sparkles },
    { id: 'entertainment', name: 'Entertainment', icon: Music },
    { id: 'fitness', name: 'Fitness/Sports', icon: Dumbbell },
    { id: 'health', name: 'Health', icon: Heart },
    { id: 'technology', name: 'Technology', icon: Laptop },
    { id: 'travel', name: 'Travel', icon: Plane }
  ];
  
  // Toggle category selection
  const toggleCategory = (categoryId) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };
  
  // Check if we have enough categories selected
  const hasMinimumCategories = selectedCategories.length >= 3;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.08,
        delayChildren: 0.3
      } 
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 50 }
    }
  };
  
  // Handle continue button click
  const handleContinue = () => {
    console.log('Selected categories:', selectedCategories);
    // Navigate to next screen or save preferences
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Let's select your favorite Interests together
          </h1>
          <p className="text-lg text-gray-600 mb-1">
            This will help for future recommendations
          </p>
          <p className="text-sm font-medium text-teal-600">
            Select at least 3 or more interests
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            const Icon = category.icon;
            
            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleCategory(category.id)}
                className={`
                  cursor-pointer rounded-xl p-4 flex flex-col items-center justify-center text-center
                  transition-all duration-200 border-2
                  ${isSelected 
                    ? 'border-teal-500 bg-teal-50' 
                    : 'border-gray-200 bg-white hover:border-gray-300'
                  }
                `}
              >
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center mb-3
                  ${isSelected ? 'bg-teal-500 text-white' : 'bg-gray-100 text-gray-600'}
                `}>
                  <Icon size={28} />
                </div>
                <h3 className="font-medium text-gray-800">{category.name}</h3>
                
                {/* Selection indicator */}
                {isSelected && (
                  <motion.div 
                    className="absolute top-2 right-2 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path 
                        d="M10 3L4.5 8.5L2 6" 
                        stroke="white" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
        
        <motion.div 
          className="mt-12 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button
            onClick={handleContinue}
            disabled={!hasMinimumCategories}
            className={`
              px-8 py-3 rounded-lg font-medium text-white shadow-sm
              transition-all duration-200 transform focus:outline-none focus:ring-2 focus:ring-offset-2
              ${hasMinimumCategories 
                ? 'bg-teal-600 hover:bg-teal-700 focus:ring-teal-500' 
                : 'bg-gray-400 cursor-not-allowed'
              }
            `}
          >
            Continue
            {selectedCategories.length > 0 && (
              <span className="ml-2">
                ({selectedCategories.length}/3)
              </span>
            )}
          </button>
        </motion.div>
        
        {/* Skip option */}
        <motion.div 
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <button 
            className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            onClick={() => console.log('Skipped category selection')}
          >
            Skip for now
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default CategorySelectionPage;