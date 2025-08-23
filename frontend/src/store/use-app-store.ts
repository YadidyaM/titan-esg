import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { type EsgData, type User, type Notification } from '@/types'

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  
  // UI state
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  
  // Data state
  esgData: EsgData[]
  selectedEsgData: EsgData | null
  isLoading: boolean
  
  // Notifications
  notifications: Notification[]
  unreadCount: number
  
  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (status: boolean) => void
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
  setEsgData: (data: EsgData[]) => void
  setSelectedEsgData: (data: EsgData | null) => void
  setLoading: (loading: boolean) => void
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      sidebarOpen: false,
      theme: 'light',
      esgData: [],
      selectedEsgData: null,
      isLoading: false,
      notifications: [],
      unreadCount: 0,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      
      setTheme: (theme) => {
        set({ theme })
        // Store theme preference in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', theme)
        }
      },
      
      setEsgData: (data) => set({ esgData: data }),
      
      setSelectedEsgData: (data) => set({ selectedEsgData: data }),
      
      setLoading: (loading) => set({ isLoading: loading }),
      
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        
        set((state) => ({
          notifications: [newNotification, ...state.notifications],
          unreadCount: state.unreadCount + 1,
        }))
      },
      
      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
          unreadCount: Math.max(0, state.unreadCount - 1),
        }))
      },
      
      clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
    }),
    {
      name: 'titan-esg-store',
    }
  )
)

// Initialize theme from localStorage
if (typeof window !== 'undefined') {
  const savedTheme = localStorage.getItem('theme') as 'light' | 'dark'
  if (savedTheme) {
    useAppStore.getState().setTheme(savedTheme)
  }
}
