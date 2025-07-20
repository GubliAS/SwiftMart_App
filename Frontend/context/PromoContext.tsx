import React, { createContext, useContext, useState } from 'react';

// joinedPromos: Array of { promoId, promoInfo, products: [product objects] }
const PromoContext = createContext(null);

export const PromoProvider = ({ children }) => {
  const [joinedPromos, setJoinedPromos] = useState([]);
  return (
    <PromoContext.Provider value={{ joinedPromos, setJoinedPromos }}>
      {children}
    </PromoContext.Provider>
  );
};

export const usePromo = () => useContext(PromoContext); 