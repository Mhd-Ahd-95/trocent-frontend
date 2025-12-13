import React from 'react'
import { useSnackbar } from 'notistack'
import AddressBooksApi from '../apis/AddressBooks.api'
import { AuthContext } from './Auth.context'
import TerminalsApi from '../apis/Terminals.api'
import { useQueryClient } from '@tanstack/react-query'

const AddressBookContext = React.createContext()

const AddressBookContextProvider = props => {
    const [loading, setLoading] = React.useState(true)
    const { enqueueSnackbar } = useSnackbar()
    const [countAddress, setCountAddress] = React.useState(0)
    const [terminals, setTerminals] = React.useState([])
    const { isAuthenticated } = React.useContext(AuthContext)
    const queryClient = useQueryClient();

    const loadAddressBookMessagers = React.useCallback(async () => {
        await queryClient.prefetchQuery({
            queryKey: ['addressBookByName', 'messagers'],
            queryFn: async () => {
                const res = await AddressBooksApi.getAddressBookByName('messagers');
                return res.data.data;
            },
            staleTime: 60 * 60 * 1000,
        });
    }, [queryClient]);


    const loadCountAddress = React.useCallback(() => {
        Promise.all([AddressBooksApi.countAddressBooks(), TerminalsApi.getTerminals()])
            .then(([ab, ter]) => {
                setCountAddress(ab.data)
                setTerminals(ter.data)
            })
            .catch((error) => {
                const message = error.response?.data.message
                const status = error.response?.status
                const errorMessage = message ? message + ' - ' + status : error.message
                enqueueSnackbar(errorMessage, { variant: 'error' })
            })
            .finally(() => setLoading(false))
    }, [enqueueSnackbar])

    React.useEffect(() => {
        if (isAuthenticated) {
            loadCountAddress()
            loadAddressBookMessagers()
        }
    }, [loadCountAddress, isAuthenticated, loadAddressBookMessagers])

    return (
        <AddressBookContext.Provider
            value={{ loading, setLoading, countAddress, setCountAddress, setTerminals, terminals }}
        >
            {props.children}
        </AddressBookContext.Provider>
    )
}

export { AddressBookContext, AddressBookContextProvider }
