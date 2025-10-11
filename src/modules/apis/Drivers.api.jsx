import CustomAxios from './customAxios'

const getDrivers = () => CustomAxios.get('/api/drivers')

const getDriver = rid => CustomAxios.get(`/api/drivers/${rid}`)

const updateDriver = (rid, ab) => {
    ab.append('_method', 'PUT');
    return CustomAxios.post(`/api/drivers/${rid}`, ab, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    })
}

const createDriver = ab => CustomAxios.post('/api/drivers', ab, {
    headers: {
        "Content-Type": "multipart/form-data",
    }
})

const deletDriver = rid => CustomAxios.delete(`/api/drivers/${rid}`)


const deletDrivers = ids => CustomAxios.delete('/api/drivers', { data: { ids } })

const downloadFile = id => CustomAxios.get(`/api/drivers/download-file/${id}`, { responseType: 'blob' })

const create_driver_login = (did, user) => CustomAxios.post(`/api/drivers/create-login/${did}`, user)

export default {
    getDriver,
    getDrivers,
    createDriver,
    updateDriver,
    deletDriver,
    deletDrivers,
    downloadFile,
    create_driver_login
}
