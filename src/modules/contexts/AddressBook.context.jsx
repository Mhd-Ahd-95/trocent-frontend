import React from 'react'
import { useSnackbar } from 'notistack'
import AddressBooksApi from '../apis/AddressBooks.api'
import { AuthContext } from './Auth.context'

const AddressBookContext = React.createContext()

const AddressBookContextProvider = props => {
    const [loading, setLoading] = React.useState(true)
    const { enqueueSnackbar } = useSnackbar()
    const [countAddress, setCountAddress] = React.useState(0)
    const { isAuthenticated } = React.useContext(AuthContext)

    const loadCountAddress = React.useCallback(() => {
        AddressBooksApi.countAddressBooks()
            .then((res) => {
                setCountAddress(res.data)
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
        }
    }, [loadCountAddress, isAuthenticated])

    return (
        <AddressBookContext.Provider
            value={{ loading, setLoading, countAddress, setCountAddress }}
        >
            {props.children}
        </AddressBookContext.Provider>
    )
}

export { AddressBookContext, AddressBookContextProvider }
