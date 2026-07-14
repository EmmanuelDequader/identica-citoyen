import { createContext, useContext, useState, useEffect } from 'react'

const SessionContext = createContext(null)

const STORAGE_KEY = 'identica_citoyen_session'

export function SessionProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : { prenom: '', ville: '' }
    } catch {
      return { prenom: '', ville: '' }
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }, [session])

  function updateSession(updates) {
    setSession((prev) => ({ ...prev, ...updates }))
  }

  function clearSession() {
    setSession({ prenom: '', ville: '' })
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <SessionContext.Provider value={{ session, updateSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const ctx = useContext(SessionContext)
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>')
  return ctx
}
