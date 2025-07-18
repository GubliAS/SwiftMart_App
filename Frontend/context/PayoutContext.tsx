import React, { createContext, useContext, useState } from "react";

const PayoutContext = createContext<any>(null);

export const PayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [payoutMethods, setPayoutMethods] = useState<any[]>([]);
  const [defaultPayoutMethodId, setDefaultPayoutMethodId] = useState<string | null>(null);
  return (
    <PayoutContext.Provider value={{ payoutMethods, setPayoutMethods, defaultPayoutMethodId, setDefaultPayoutMethodId }}>
      {children}
    </PayoutContext.Provider>
  );
};

export const usePayout = () => useContext(PayoutContext); 