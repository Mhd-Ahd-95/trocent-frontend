import axios from 'axios'
import global from '../global'
import CustomAPI from './customAxios'

const { baseURL, headers } = global.apis

const AuthAPI = axios.create({
  baseURL: `${baseURL}/api`,
  headers: headers
})

export const login = (username, password, remember) => AuthAPI.post('/login', { username: username, password: password, remember: remember })

export const logout = () => CustomAPI.post('/api/logout')

const exportedObject = {
  login,
  logout
}
export default exportedObject
