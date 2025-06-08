"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { headers } from "next/headers";
import React, { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
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
  const { getToken } = useAuth();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  const createNewChat = async () => {
    try {
      if (!user) return null;
      const token = await getToken();
      await axios.post(
        "/api/chat/create",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUserChat();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const fetchUserChat = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.post(
        "/api/chat/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (data.success) {
        console.log(data.data);
        setChats(data.data);
        // If data no chat, create onoe
        if (data.data.length === 0) {
          await createNewChat();
          return fetchUserChat();
        } else {
          //sort chat by update date
          data.data.sort((a: any, b: any) => {
            return (
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
            );
          });
          //set recently updated as selected chat
          setSelectedChat(data.data[0]);
          console.log(data.data[0]);
        }
      } else {
        toast.error(data.message);
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    if (user) {
      fetchUserChat();
    }
  }, [user]);

  const value = {
    user,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    fetchUserChat,
    createNewChat,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
