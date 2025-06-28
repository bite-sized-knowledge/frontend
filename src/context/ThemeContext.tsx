// src/ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import {Appearance} from 'react-native';
import {darkTheme, lightTheme} from '../styles/themes';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Theme {
  background: string;
  text: string;
  gray1: string;
  gray2: string;
  gray3: string;
  gray4: string;
  main: string;
  sub: string;
  refreshIndicator: string;
}

interface ThemeContextType {
  theme: Theme;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  saveLocalTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({children}) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  const [isSystemTheme, setIsSystemTheme] = useState(false); // 시스템 테마 사용 여부 추적

  const getLocalTheme = async () => {
    const theme = await AsyncStorage.getItem('theme');
    return theme as 'light' | 'dark' | null;
  };

  const saveLocalTheme = async (theme: 'light' | 'dark') => {
    await AsyncStorage.setItem('theme', theme);
  };

  // 초기 테마 설정
  useEffect(() => {
    const initializeTheme = async () => {
      const savedTheme = await getLocalTheme();

      if (savedTheme) {
        // 저장된 테마가 있으면 사용
        setThemeMode(savedTheme);
        setIsSystemTheme(false);
      } else {
        // 저장된 테마가 없으면 시스템 테마 사용
        const systemTheme = Appearance.getColorScheme();
        setThemeMode(systemTheme || 'light');
        setIsSystemTheme(true);
      }
    };

    initializeTheme();
  }, []);

  // 시스템 테마 변경 리스너 (저장된 테마가 없을 때만)
  useEffect(() => {
    if (!isSystemTheme) {
      return;
    }

    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      if (colorScheme && isSystemTheme) {
        setThemeMode(colorScheme);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isSystemTheme]);

  const toggleTheme = async () => {
    const newTheme = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newTheme);
    setIsSystemTheme(false); // 수동 변경하면 시스템 테마 추적 중단
    await saveLocalTheme(newTheme);
  };

  const theme = themeMode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{theme, themeMode, toggleTheme, saveLocalTheme}}>
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
