import { ThemeContextProvider, ThemeContext } from './Theme.context'
import { AuthContextProvider, AuthContext } from './Auth.context'
import { AlertProvider } from '../components'

const ContextProvider = props => {
  return (
    <ThemeContextProvider>
      <AlertProvider>
        <AuthContextProvider>{props.children}</AuthContextProvider>
      </AlertProvider>
    </ThemeContextProvider>
  )
}

export {
  ContextProvider,
  ThemeContextProvider,
  ThemeContext,
  AuthContextProvider,
  AuthContext
}
