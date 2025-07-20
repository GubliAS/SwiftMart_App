import React, { createContext, useContext, useState } from "react";

const NotificationContext = createContext<any>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [newOrderNotification, setNewOrderNotification] = useState(false);
  const [lowStockNotification, setLowStockNotification] = useState(false);
  const [swiftMartAnnouncements, setSwiftMartAnnouncements] = useState(false);

  return (
    <NotificationContext.Provider value={{
      newOrderNotification, setNewOrderNotification,
      lowStockNotification, setLowStockNotification,
      swiftMartAnnouncements, setSwiftMartAnnouncements
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext); 