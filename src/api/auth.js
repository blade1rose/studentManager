import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
})

export const login = (user) => API.post('/login', user)
export const register = (user) => API.post('/register', user)
