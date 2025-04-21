/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';
import { useAuth } from '../context/AuthContext';
import DashboardNavbar from '../components/DashboardNavbar';
import Sidebar from '../components/Sidebar';
import { Camera, Save, X } from 'lucide-react';

const ProfilePage = () => {
  const { profile, updateProfileField, updateSocial } = useProfile();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name || '',
    bio: profile.bio || '',
    profileImage: profile.profileImage || '',
    twitter: profile.socials?.twitter || '',
    facebook: profile.socials?.facebook || '',
    instagram: profile.socials?.instagram || '',
    linkedin: profile.socials?.linkedin || ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfileField('name', formData.name);
    updateProfileField('bio', formData.bio);
    updateProfileField('profileImage', formData.profileImage);
    
    
    updateSocial('twitter', formData.twitter);
    updateSocial('facebook', formData.facebook);
    updateSocial('instagram', formData.instagram);
    updateSocial('linkedin', formData.linkedin);
    
    setIsEditing(false);
  };

 
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          profileImage: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <DashboardNavbar />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="pl-24 pr-6 pt-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h1>

          <div className="bg-white rounded-lg shadow p-6">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              {/* Profile Image */}
              <div className="relative">
                {formData.profileImage ? (
                  <img 
                    src={formData.profileImage} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200" 
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-medium">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full cursor-pointer">
                    <Camera size={16} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                    />
                  </label>
                )}
              </div>

              <div className="text-center md:text-left md:flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {isEditing ? (
                    <input 
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border border-gray-300 rounded-md px-3 py-1 w-full max-w-xs"
                    />
                  ) : (
                    profile.name
                  )}
                </h2>
                <p className="text-gray-500">{user?.role === 'organizer' ? 'Event Organizer' : 'Event Attendee'}</p>
                <div className="mt-2">
                  {isEditing ? (
                    <div className="flex gap-2 justify-center md:justify-start">
                      <button 
                        onClick={handleSubmit}
                        className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                      >
                        <Save size={16} />
                        <span>Save</span>
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex items-center space-x-1 bg-gray-300 text-gray-700 px-3 py-1 rounded-md hover:bg-gray-400"
                      >
                        <X size={16} />
                        <span>Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="text-orange-500 hover:text-orange-600 font-medium"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bio Section */}
              <div className="col-span-2">
                <h3 className="text-md font-semibold text-gray-700 mb-2">About Me</h3>
                {isEditing ? (
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-md px-3 py-2 w-full h-24"
                    placeholder="Write a short bio about yourself..."
                  />
                ) : (
                  <p className="text-gray-600">
                    {profile.bio || "No bio provided yet."}
                  </p>
                )}
              </div>

              {/* Social Links (Show for attendees) */}
              {user?.role === 'attendee' && (
                <div className="col-span-2">
                  <h3 className="text-md font-semibold text-gray-700 mb-2">Social Links</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Twitter</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          name="twitter"
                          value={formData.twitter}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-md px-3 py-1 w-full"
                          placeholder="https://twitter.com/username"
                        />
                      ) : (
                        <p className="text-gray-600">
                          {profile.socials?.twitter || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Facebook</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-md px-3 py-1 w-full"
                          placeholder="https://facebook.com/username"
                        />
                      ) : (
                        <p className="text-gray-600">
                          {profile.socials?.facebook || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">Instagram</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          name="instagram"
                          value={formData.instagram}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-md px-3 py-1 w-full"
                          placeholder="https://instagram.com/username"
                        />
                      ) : (
                        <p className="text-gray-600">
                          {profile.socials?.instagram || "Not provided"}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-gray-600 text-sm mb-1">LinkedIn</label>
                      {isEditing ? (
                        <input 
                          type="text"
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleChange}
                          className="border border-gray-300 rounded-md px-3 py-1 w-full"
                          placeholder="https://linkedin.com/in/username"
                        />
                      ) : (
                        <p className="text-gray-600">
                          {profile.socials?.linkedin || "Not provided"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;