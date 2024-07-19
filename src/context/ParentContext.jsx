// ParentContext.js
import React, { createContext, useState } from 'react';

// Create a context with default value
const ParentContext = createContext();

const ParentProvider = ({ children }) => {
  const [parentId, setParentId] = useState(0);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <ParentContext.Provider value={{ parentId, setParentId }}>
      {children}
    </ParentContext.Provider>
  );
};

export { ParentContext, ParentProvider };
