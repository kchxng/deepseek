"use client";
import { useUser } from "@clerk/nextjs";
import React, { createContext, useContext } from "react";
// 1.
interface AppContextType {
  user: ReturnType<typeof useUser>["user"];
}

// 2.
const AppContext = createContext<AppContextType | null>(null);

// 3. Create custom hook
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppContextProvider");
  }
  return context;
};

// 4. AppContextProvider
type Props = {
  children: React.ReactNode;
};
export const AppContextProvider = ({ children }: Props) => {
  const { user } = useUser();
  const value = { user };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
