import { ThemeContextProvider, ThemeContext } from './Theme.context'
import { AuthContextProvider, AuthContext } from './Auth.context'
import { VehicleTypeContext, VehicleTypeContextProvider } from './VehicleType.context'
import { RoleContextProvider, RoleContext } from './Role.context'
import { AlertProvider } from '../components'

const ContextProvider = props => {
  return (
    <ThemeContextProvider>
      <AlertProvider>
        <AuthContextProvider>
          <RoleContextProvider>
            <VehicleTypeContextProvider>
              {props.children}
            </VehicleTypeContextProvider>
            </RoleContextProvider>
        </AuthContextProvider>
      </AlertProvider>
    </ThemeContextProvider>
  )
}

export {
  ContextProvider,
  ThemeContextProvider,
  ThemeContext,
  AuthContextProvider,
  AuthContext,
  RoleContextProvider,
  RoleContext,
  VehicleTypeContextProvider,
  VehicleTypeContext
}
