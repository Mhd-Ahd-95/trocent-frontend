import React from 'react'
import { useSnackbar } from 'notistack'
import AddressBooksApi from '../apis/AddressBooks.api'
import { AuthContext } from './Auth.context'

const AddressBookContext = React.createContext()

const AddressBookContextProvider = props => {
    const [loading, setLoading] = React.useState(true)
    const { enqueueSnackbar } = useSnackbar()
    const [addressBooks, setAddressBooks] = React.useState([])
    const { isAuthenticated } = React.useContext(AuthContext)

    const loadAddressBooks = React.useCallback(() => {
        AddressBooksApi.getAddressBooks()
            .then((res) => {
                const result = res.data.data
                setAddressBooks(result)
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
            loadAddressBooks()
        }
    }, [loadAddressBooks, isAuthenticated])

    return (
        <AddressBookContext.Provider
            value={{ loading, setLoading, addressBooks, setAddressBooks }}
        >
            {props.children}
        </AddressBookContext.Provider>
    )
}

export { AddressBookContext, AddressBookContextProvider }
