import { createContext, useContext, useState } from "react";

export const MenuContext = createContext();
export const useMenu = () => useContext(MenuContext);

export default function MenuProvider({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <MenuContext.Provider
      value={{
        menuOpen,
        setMenuOpen
      }}
    >
      { children }
    </MenuContext.Provider>
  )
};