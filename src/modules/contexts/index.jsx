import { AlertProvider } from '../components'
import { ThemeContextProvider, ThemeContext } from './Theme.context'
import { AuthContextProvider, AuthContext } from './Auth.context'
import { RoleContextProvider, RoleContext } from './Role.context'
import { AddressBookContextProvider, AddressBookContext } from './AddressBook.context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ContextProvider = props => {

  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AlertProvider>
          <AuthContextProvider>
            <RoleContextProvider>
                <AddressBookContextProvider>
                  {props.children}
                </AddressBookContextProvider>
            </RoleContextProvider>
          </AuthContextProvider>
        </AlertProvider>
      </ThemeContextProvider>
    </QueryClientProvider>
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
  AddressBookContextProvider,
  AddressBookContext
}
