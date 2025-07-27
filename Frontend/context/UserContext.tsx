import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { BASE_URL } from "@/constants/env";

interface User {
  id?: number | string;
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
  id: undefined,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  role: '',
  verificationStatus: '',
  storeName: '',
  idCardType: '',
  idCardCountry: '',
  idCardNumber: '',
  photo: null,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User>(defaultUser);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(defaultUser);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("User fetch status:", res.status);
        if (res.ok) {
          const data = await res.json();
          console.log("Fetched user data:", data);
          setUser((prev) => ({
            ...prev,
            ...data,
            id: data.id || prev.id,
            phoneNumber: data.phoneNumber || data.phone_number || prev.phoneNumber,
          }));
        } else {
          const errorText = await res.text();
          console.log("User fetch failed:", errorText);
          setUser(defaultUser);
        }
      } catch (e) {
        console.log("User fetch error:", e);
        setUser(defaultUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
      {loading && (
        <View style={{
          position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
          justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 9999
        }}>
          <ActivityIndicator size="large" color="#156651" />
        </View>
      )}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
}; 