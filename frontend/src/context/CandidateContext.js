import React, { createContext, useState } from 'react';

export const CandidateContext = createContext();

export const CandidateProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);

  const updateProfile = (profileData) => {
    setProfile(profileData);
  };

  const addApplication = (application) => {
    setApplications([...applications, application]);
  };

  const updateApplication = (id, status) => {
    setApplications(applications.map(app =>
      app.id === id ? { ...app, status } : app
    ));
  };

  return (
    <CandidateContext.Provider value={{
      profile,
      applications,
      updateProfile,
      addApplication,
      updateApplication
    }}>
      {children}
    </CandidateContext.Provider>
  );
};
