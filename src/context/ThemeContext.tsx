import React, {createContext, useContext, useState, useEffect} from 'react';
import {useColorScheme} from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  return (
    <ThemeContext.Provider value={{isDark, setIsDark}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
