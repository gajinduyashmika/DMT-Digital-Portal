import { create } from 'zustand';

export const useStore = create((set) => ({
    isCollapsed: false,
    language: 'en',
    isDarkMode: false,
    isChatOpen: false,
    chatContext: null, // { type, id, reference, title }
    isTopBarVisible: true,
    userEmail: null,
    userName: null,
    setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
    setLanguage: (language) => set({ language }),
    setDarkMode: (isDark) => set({ isDarkMode: isDark }),
    setChatOpen: (isOpen) => set({ isChatOpen: isOpen }),
    setChatContext: (context) => set({ chatContext: context }), // Allow setting context without opening chat
    openSupport: (context) => set({ isChatOpen: true, chatContext: context }),
    setTopBarVisible: (isVisible) => set({ isTopBarVisible: isVisible }),
    setUserEmail: (email) => {
        if (email) {
            localStorage.setItem('userEmail', email);
        } else {
            localStorage.removeItem('userEmail');
        }
        set({ userEmail: email });
    },
    setUserName: (name) => {
        if (name) {
            localStorage.setItem('userName', name);
        } else {
            localStorage.removeItem('userName');
        }
        set({ userName: name });
    },
    initializeUser: () => {
        const email = localStorage.getItem('userEmail');
        const name = localStorage.getItem('userName');
        set({ userEmail: email, userName: name });
    },
}));
