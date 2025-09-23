import CustomAxios from './customAxios'

const getVehicleTypes = () => CustomAxios.get('/api/vehicle-types')

const getVehicleType = rid => CustomAxios.get(`/api/vehile/${rid}`)

const updateVehicleType = (rid, VehicleType) =>
  CustomAxios.put(`/api/vehicle-types/${rid}`, VehicleType)

const createVehicleType = VehicleType =>
  CustomAxios.post('/api/vehicle-types', VehicleType)

const deleteVehicleType = rid => CustomAxios.delete(`/api/vehicle-types/${rid}`)

const deleteVehicleTypes = ids =>
  CustomAxios.delete(`/api/vehicle-types`, { data: { ids } })

export default {
  getVehicleType,
  getVehicleTypes,
  createVehicleType,
  updateVehicleType,
  deleteVehicleType,
  deleteVehicleTypes
}
