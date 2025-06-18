import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Candidature } from '../types';

interface CandidatureContextType {
  candidatures: Candidature[];
  addCandidature: (candidature: Candidature) => void;
}

const CandidatureContext = createContext<CandidatureContextType | undefined>(undefined);

export const useCandidature = () => {
  const context = useContext(CandidatureContext);
  if (!context) {
    throw new Error('useCandidature must be used within a CandidatureProvider');
  }
  return context;
};

interface CandidatureProviderProps {
  children: ReactNode;
}

export const CandidatureProvider: React.FC<CandidatureProviderProps> = ({ children }) => {
  // Initial sample candidatures
  const [candidatures, setCandidatures] = useState<Candidature[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@example.com',
      age: 24,
      experience: 'I have been playing on FiveM servers for 3 years and have moderation experience on two other servers.',
      why: 'I love the Enigma RP community and want to help it grow by ensuring a positive environment for all players.',
      hours: 20,
      discord: 'johndoe#1234',
      date: new Date('2023-04-15'),
      status: 'pending'
    },
    {
      id: '2',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      age: 28,
      experience: 'Former admin on Liberty RP and GTA World. 5+ years of moderation experience.',
      why: 'I believe in fair moderation and want to be part of a growing server with potential.',
      hours: 15,
      discord: 'janesmith#5678',
      date: new Date('2023-05-20'),
      status: 'approved'
    }
  ]);

  const addCandidature = (candidature: Candidature) => {
    setCandidatures([...candidatures, candidature]);
  };

  return (
    <CandidatureContext.Provider
      value={{
        candidatures,
        addCandidature,
      }}
    >
      {children}
    </CandidatureContext.Provider>
  );
};