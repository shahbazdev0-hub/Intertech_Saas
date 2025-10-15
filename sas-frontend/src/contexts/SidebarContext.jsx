import { createContext, useContext, useState, useEffect } from "react";
import { useMediaQuery } from "@uidotdev/usehooks";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const isDesktopDevice = useMediaQuery("(min-width: 768px)");
  const [collapsed, setCollapsed] = useState(!isDesktopDevice);

  useEffect(() => {
    setCollapsed(!isDesktopDevice);
  }, [isDesktopDevice]);

  const value = {
    collapsed,
    setCollapsed,
    isDesktopDevice,
    sidebarWidth: collapsed ? 70 : 240,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
