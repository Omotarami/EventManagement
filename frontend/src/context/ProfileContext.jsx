import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';


export const ProfileContext = createContext();


export const useProfile = () => {
  return useContext(ProfileContext);
};

const ProfileProvider = ({ children }) => {
  const { user } = useAuth();
  
  
  const [profile, setProfile] = useState(() => {
    const savedProfile = localStorage.getItem('userProfile');
    return savedProfile ? JSON.parse(savedProfile) : {
      userId: user?.id || '',
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role || '',
      bio: '',
      profileImage: '',
      socials: {
        twitter: '',
        facebook: '',
        instagram: '',
        linkedin: ''
      },
      preferences: {
        notifications: {
          email: true,
          push: true
        }
      }
    };
  });


  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  }, [profile]);

  
  const updateProfile = (newProfile) => {
    setProfile(newProfile);
  };

 
  const updateProfileField = (field, value) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      [field]: value
    }));
  };


  const updateSocial = (platform, url) => {
    setProfile(prevProfile => ({
      ...prevProfile,
      socials: {
        ...prevProfile.socials,
        [platform]: url
      }
    }));
  };

  return (
    <ProfileContext.Provider value={{
      profile,
      updateProfile,
      updateProfileField,
      updateSocial
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileProvider;