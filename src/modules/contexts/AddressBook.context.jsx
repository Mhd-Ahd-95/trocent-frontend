import React from 'react'
import { useSnackbar } from 'notistack'
import AddressBooksApi from '../apis/AddressBooks.api'
import { AuthContext } from './Auth.context'
import { useQueryClient } from '@tanstack/react-query'
import QuestionsApi from '../apis/Questions.api'

const AddressBookContext = React.createContext()

const HOUR = 60 * 60 * 1000

const AddressBookContextProvider = props => {

    const [loading, setLoading] = React.useState(true)
    const { enqueueSnackbar } = useSnackbar()
    const [countAddress, setCountAddress] = React.useState(0)
    const { isAuthenticated, parsedUser } = React.useContext(AuthContext)
    const queryClient = useQueryClient();

    const loadAddressBookByTerminals = React.useCallback(async () => {
        await queryClient.prefetchQuery({
            queryKey: ['addressBookByTerminals'],
            queryFn: async () => {
                const res = await AddressBooksApi.getAddressBookByTerminals();
                return res.data.data;
            },
            staleTime: HOUR,
            gcTime: HOUR,
        });
    }, [queryClient]);

    const loadAddressBookMessagers = React.useCallback(async () => {
        await queryClient.prefetchQuery({
            queryKey: ['addressBookByName', 'messagers'],
            queryFn: async () => {
                const res = await AddressBooksApi.getAddressBookByName('messagers');
                return res.data;
            },
            staleTime: HOUR,
            gcTime: HOUR,
        });
    }, [queryClient]);

    const loadDriverQuestions = React.useCallback(async () => {
        await queryClient.prefetchQuery({
            queryKey: ['questions'],
            queryFn: async () => {
                const res = await QuestionsApi.getSectionWithQuestions();
                return res.data || {};
            },
            staleTime: HOUR,
            gcTime: HOUR,
        });
    }, [queryClient]);

    const loadCountAddress = React.useCallback(() => {
        AddressBooksApi.countAddressBooks()
            .then((ab) => {
                setCountAddress(ab.data)
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
        if (!isAuthenticated || !parsedUser) return
        if (parsedUser.type !== 'driver') {
            loadCountAddress()
            loadAddressBookByTerminals()
            loadAddressBookMessagers()
        } else {
            loadDriverQuestions()
        }
    }, [loadCountAddress, isAuthenticated, loadAddressBookByTerminals, loadDriverQuestions, loadAddressBookMessagers])

    return (
        <AddressBookContext.Provider
            value={{ loading, setLoading, countAddress, setCountAddress }}
        >
            {props.children}
        </AddressBookContext.Provider>
    )
}

export { AddressBookContext, AddressBookContextProvider }
