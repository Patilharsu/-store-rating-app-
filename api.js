import axios from 'axios';

export const api = axios.create({
  baseURL: '/api'
});

export function authHeader(token) {
  return token ? { Authorization: `Bearer ${token}` } : {};
}
