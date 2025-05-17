"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

type AppStateContextType = {
  isWalletConnected: boolean
  setWalletConnected: (connected: boolean) => void
}

const AppStateContext = createContext<AppStateContextType>({
  isWalletConnected: false,
  setWalletConnected: () => {},
})

export const useAppState = () => useContext(AppStateContext)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [isWalletConnected, setWalletConnected] = useState<boolean>(false)

  return (
    <AppStateContext.Provider value={{ isWalletConnected, setWalletConnected }}>{children}</AppStateContext.Provider>
  )
}
