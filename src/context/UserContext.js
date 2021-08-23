import React, { useState, createContext } from "react";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  var localStorageUser = localStorage.getItem("user");
  if (localStorageUser === "" || localStorageUser === "undefined") {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }
  const localSt = JSON.parse(localStorage.getItem("user"));
  const [user, setUser] = useState(localSt ? localSt : null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
