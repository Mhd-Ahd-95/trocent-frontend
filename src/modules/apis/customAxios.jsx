import axios from 'axios'
import global from '../global'

const { baseURL, headers } = global.apis

const CustomAxios = axios.create({
    baseURL,
    headers,
})

CustomAxios.interceptors.request.use(
    (request) => {
        const token = localStorage.getItem('token')
        if (token) {
            request.headers.Authorization = `Bearer ${token}`
        }
        return request
    },
    (error) => Promise.reject(error)
)

CustomAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.clear()

            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default CustomAxios