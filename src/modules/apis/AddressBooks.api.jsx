import CustomAxios from './customAxios'

const getAddressBooks = () => CustomAxios.get('/api/address-books')

const getAddressBook = rid => CustomAxios.get(`/api/address-books/${rid}`)

const updateAddressBook = (rid, ab) => CustomAxios.put(`/api/address-books/${rid}`, ab)

const createAddressBook = ab => CustomAxios.post('/api/address-books', ab)

const deleteAddressBook = rid => CustomAxios.delete(`/api/address-books/${rid}`)

const deleteAddressBooks = ids => CustomAxios.delete('/api/address-books', { data: { ids } })

const countAddressBooks = () => CustomAxios.get('/api/address-books/count')

const patchABook = (id, obj) => CustomAxios.patch(`/api/address-books/${id}`, obj)

export default {
    getAddressBook,
    getAddressBooks,
    createAddressBook,
    updateAddressBook,
    deleteAddressBook,
    deleteAddressBooks,
    countAddressBooks,
    patchABook
}
