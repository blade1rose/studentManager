import axios from 'axios'

const API = axios.create({
  baseURL: '/api/auth',
})

export const login = (user) => API.post('/login', user)
export const register = (user) => API.post('/register', user)
