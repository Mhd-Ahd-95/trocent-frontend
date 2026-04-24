import { createContext, useState, useCallback, useMemo } from 'react'

const AuthContext = createContext()

const safeParseUser = (raw) => {
  try {
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const AuthContextProvider = ({ children }) => {
  
  const [authState, setAuthState] = useState(() => {
    const raw = localStorage.getItem('authedUser')
    const user = safeParseUser(raw)
    return { isAuthenticated: !!user, user: raw, parsedUser: user, }
  })

  const handleAuth = useCallback((isAuth, userJson = null) => {
    if (isAuth && userJson) {
      const parsed = safeParseUser(userJson)
      if (!parsed) return
      localStorage.setItem('authedUser', userJson)
      if (parsed.access_token) {
        localStorage.setItem('token', parsed.access_token)
      }
      setAuthState({ isAuthenticated: true, user: userJson, parsedUser: parsed, })
    } else {
      localStorage.removeItem('authedUser')
      localStorage.removeItem('token')

      setAuthState({ isAuthenticated: false, user: null, parsedUser: null, })
    }
  }, [])

  const value = useMemo(() => ({ isAuthenticated: authState.isAuthenticated, user: authState.user, parsedUser: authState.parsedUser, handleAuth, }), [authState, handleAuth])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthContextProvider, safeParseUser }