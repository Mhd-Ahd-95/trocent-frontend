import React, { createContext, useState } from 'react'
import AuthAPI from '../apis/login.api'

const AuthContext = createContext()

const AuthContextProvider = props => {
  const [authState, setAuthState] = useState({
    isAuthenticated: localStorage.getItem('authedUser')
      ? localStorage.getItem('authedUser')
      : false,
    user: localStorage.getItem('authedUser')
  })

  const handleLogout = () => {
    AuthAPI.logout()
      .then(res => {
        if (res.data) handleAuth(false)
      })
      .catch(err => {
        console.log('failed to logout')
      })
  }

  const handleAuth = (isAuth, user = null) => {
    let loggedOut = false
    if (isAuth) {
      localStorage.setItem('authedUser', user)
    } else {
      loggedOut = true
      localStorage.clear()
      sessionStorage.clear()
    }
    setAuthState({
      ...authState,
      user: user,
      isAuthenticated: isAuth,
      loggedOut: loggedOut
    })
  }

  return (
    <AuthContext.Provider value={{ ...authState, handleAuth, handleLogout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthContextProvider }
