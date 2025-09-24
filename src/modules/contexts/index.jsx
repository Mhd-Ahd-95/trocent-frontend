import { AlertProvider } from '../components'
import { ThemeContextProvider, ThemeContext } from './Theme.context'
import { AuthContextProvider, AuthContext } from './Auth.context'
import { VehicleTypeContext, VehicleTypeContextProvider } from './VehicleType.context'
import { RoleContextProvider, RoleContext } from './Role.context'
import { AddressBookContextProvider, AddressBookContext } from './AddressBook.context'

const ContextProvider = props => {
  return (
    <ThemeContextProvider>
      <AlertProvider>
        <AuthContextProvider>
          <RoleContextProvider>
            <VehicleTypeContextProvider>
              <AddressBookContextProvider>
                {props.children}
              </AddressBookContextProvider>
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
  VehicleTypeContext,
  AddressBookContextProvider,
  AddressBookContext
}
