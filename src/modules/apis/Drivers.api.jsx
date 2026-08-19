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

const driverClockInOut = (did, cid, clock_in, clock_out) => CustomAxios.post(`/api/drivers/clock-in-out/${did}`, { cid: cid ?? null, clock_in, clock_out })

const driverKmInOut = (did, kid, km_in, km_out) => CustomAxios.post(`/api/drivers/km-in-out/${did}`, { kid: kid ?? null, km_in, km_out })

const getDriverTimeToday = (did) => CustomAxios.get(`/api/drivers/clock-in-out/${did}/time`)

const driverHasKmIOToday = (did) => CustomAxios.get(`/api/drivers/km-in-out/${did}/today`)

const updateDriverLanguage = (did, lang) => CustomAxios.patch(`/api/drivers/language/${did}/${lang}`)

export default {
    getDriver,
    getDrivers,
    createDriver,
    updateDriver,
    deletDriver,
    deletDrivers,
    downloadFile,
    create_driver_login,
    driverClockInOut,
    getDriverTimeToday,
    updateDriverLanguage,
    driverKmInOut,
    driverHasKmIOToday
}
