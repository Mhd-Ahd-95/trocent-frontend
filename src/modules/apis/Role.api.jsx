import CustomAxios from './customAxios'

const getRoles = () => CustomAxios.get('/api/roles')

const getRole = rid => CustomAxios.get(`/api/roles/${rid}`)

const updateRole = (rid, role) => CustomAxios.put(`/api/roles/${rid}`, role)

const createRole = role => CustomAxios.post('/api/roles', role)

const deleteRole = rid => CustomAxios.delete(`/api/roles/${id}`)

export default {
  getRole,
  getRoles,
  updateRole,
  createRole,
  deleteRole
}
