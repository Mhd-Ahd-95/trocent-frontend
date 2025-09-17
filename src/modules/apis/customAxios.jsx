import axios from 'axios'
import global from '../global'

const { baseURL, headers } = global.apis

const CustomAxios = axios.create({
    baseURL: `${baseURL}`,
    headers
});

const requestHandler = request => {
    request.headers.Authorization = 'Bearer ' + localStorage.getItem('token');
    return request;
};

const responseHandler = response => {
    return response;
};

const errorHandler = error => {
    if (error.response.status === 401) {
        localStorage.clear()
        sessionStorage.clear()
        window.location = '/login'
    }
    return Promise.reject(error);
};

CustomAxios.interceptors.request.use(
    (request) => requestHandler(request),
    (error) => errorHandler(error)
);

CustomAxios.interceptors.response.use(
    (response) => responseHandler(response),
    (error) => errorHandler(error)
);

export default CustomAxios