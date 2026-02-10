"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"
import type { UserRole } from "./types"

interface AuthContextType {
  role: UserRole
  setRole: (role: UserRole) => void
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("participant")

  const setRole = useCallback((newRole: UserRole) => {
    setRoleState(newRole)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        role,
        setRole,
        isAdmin: role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within AuthProvider")
  return context
}
