import React, { createContext, useState } from 'react';

export const CompanyContext = createContext();

export const CompanyProvider = ({ children }) => {
  const [internships, setInternships] = useState([]);
  const [applicants, setApplicants] = useState([]);

  const addInternship = (internship) => {
    setInternships([...internships, internship]);
  };

  const updateInternship = (id, updatedData) => {
    setInternships(internships.map(item => 
      item.id === id ? { ...item, ...updatedData } : item
    ));
  };

  const deleteInternship = (id) => {
    setInternships(internships.filter(item => item.id !== id));
  };

  return (
    <CompanyContext.Provider value={{
      internships,
      applicants,
      addInternship,
      updateInternship,
      deleteInternship,
      setApplicants
    }}>
      {children}
    </CompanyContext.Provider>
  );
};
