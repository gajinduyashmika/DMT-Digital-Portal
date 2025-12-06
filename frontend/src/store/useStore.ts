import { create } from 'zustand';

type Language = 'en' | 'si' | 'ta';

interface State {
  isCollapsed: boolean;
  language: Language;
  isDarkMode: boolean;
  isChatOpen: boolean;
  setCollapsed: (collapsed: boolean) => void;
  setLanguage: (language: Language) => void;
  setDarkMode: (isDark: boolean) => void;
  setChatOpen: (isOpen: boolean) => void;
}

export const useStore = create<State>((set) => ({
  isCollapsed: false,
  language: 'en',
  isDarkMode: false,
  isChatOpen: false,
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  setLanguage: (language) => set({ language }),
  setDarkMode: (isDark) => set({ isDarkMode: isDark }),
  setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
}));