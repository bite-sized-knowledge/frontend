// src/ThemeContext.tsx
import React, {createContext, useContext, useState, ReactNode} from 'react';
import {Appearance} from 'react-native';
import {darkTheme, lightTheme} from '../styles/themes';

interface Theme {
  background: string;
  text: string;
  gray1: string;
  gray2: string;
  gray3: string;
  gray4: string;
  main: string;
  sub: string;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const systemTheme = Appearance.getColorScheme(); // 시스템 설정 가져오기
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(
    systemTheme || 'light',
  );

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{theme, themeMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

// 테마를 쉽게 가져올 수 있도록 커스텀 훅 생성
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
