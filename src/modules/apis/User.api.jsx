import CustomAxios from './customAxios'

const getUsers = () => CustomAxios.get('/api/users')

const getUser = uid => CustomAxios.get(`/api/users/${uid}`)

const updateUser = (uid, user) => CustomAxios.put(`/api/users/${uid}`, user)

const createUser = user => CustomAxios.post('/api/users', user)

const deleteUser = uid => CustomAxios.delete(`/api/users/${uid}`)

export default {
  getUser,
  getUsers,
  updateUser,
  createUser,
  deleteUser
}
