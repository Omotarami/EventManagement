/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, X, Image } from "lucide-react";
import { FormSection } from "../EventForm/FormComponents";

/**
 * ImageUploader component
 * Handles drag-and-drop and click-to-upload functionality for event images
 * 
 * @param {Object} props
 * @param {Array} props.images 
 * @param {Function} props.onImagesChange 
 */
const ImageUploader = ({ images = [], onImagesChange }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  
  const processFiles = useCallback(
    (files) => {
     
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter((file) =>
        file.type.startsWith("image/")
      );

      if (imageFiles.length === 0) {
        return;
      }

      
      const newImages = imageFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));

      
      onImagesChange([...images, ...newImages]);
    },
    [images, onImagesChange]
  );

  
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles]
  );

  
  const handleFileChange = useCallback(
    (e) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        
        e.target.value = "";
      }
    },
    [processFiles]
  );

  
  const handleAddImageClick = () => {
    fileInputRef.current?.click();
  };

  
  const handleRemoveImage = (index) => {
    const newImages = [...images];
    
    
    if (newImages[index].preview) {
      URL.revokeObjectURL(newImages[index].preview);
    }
    
    newImages.splice(index, 1);
    onImagesChange(newImages);
  };

  return (
    <FormSection label="Event Image(s)">
      <div className="mb-4">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />

        {/* Drop area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-all text-center 
            ${isDragging ? "border-orange-400 bg-orange-50" : "border-gray-300 bg-gray-50"}`}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleAddImageClick}
          style={{ cursor: "pointer", minHeight: "200px" }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <Upload
              size={32}
              className={`mb-3 ${isDragging ? "text-orange-500" : "text-gray-400"}`}
            />
            <p className="text-gray-700 mb-1">
              Click To Add An Image Or Drag And Drop
            </p>
            <p className="text-sm text-gray-500">
              Support for JPG, PNG or GIF (Max 5MB each)
            </p>
          </div>
        </div>

        {/* Image previews */}
        {images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative rounded-lg overflow-hidden border border-gray-200 group"
                style={{ aspectRatio: "16/9" }}
              >
                <img
                  src={image.preview || image.url}
                  alt={`Event image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                
                {/* Image overlay with remove button */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(index);
                    }}
                    className="p-1.5 bg-white rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </motion.button>
                </div>

                {/* Image indicator dots at bottom */}
                {index === 0 && images.length > 1 && (
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1">
                    {images.map((_, dotIndex) => (
                      <div
                        key={dotIndex}
                        className={`w-1.5 h-1.5 rounded-full ${
                          dotIndex === 0 ? "bg-white" : "bg-white bg-opacity-50"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </FormSection>
  );
};

export default ImageUploader;