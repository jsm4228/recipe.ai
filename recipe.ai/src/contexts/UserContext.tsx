import React, { ReactNode } from "react";
import { createContext, Dispatch, useState, SetStateAction } from "react";

export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
};

export type UserContextType = {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
};

const defaultState = {
  user: {
    _id: "",
    username: "",
    email: "",
    password: "",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  setUser: (user: User) => {},
} as UserContextType;

export const UserContext = React.createContext(defaultState);

type UserProviderProps = { children: ReactNode };

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User>({
    _id: "",
    username: "",
    email: "",
    password: "",
    createdAt: new Date(),
    updatedAt: new Date(),
    accessToken: "",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
