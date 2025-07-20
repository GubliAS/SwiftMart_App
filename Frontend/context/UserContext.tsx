import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: string;
  verificationStatus?: string;
  storeName?: string;
  idCardType?: string;
  idCardCountry?: string;
  idCardNumber?: string;
  photo?: any;
}

interface UserContextType {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}

const defaultProfilePic = require('@/assets/images/userPic.jpeg');

const defaultUser: User = {
  firstName: 'Claire',
  lastName: 'Cooper',
  email: 'claire.cooper@mail.com',
  phoneNumber: '',
  role: '',
  verificationStatus: '',
  storeName: '',
  idCardType: '',
  idCardCountry: '',
  idCardNumber: '',
  photo: defaultProfilePic,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}; 