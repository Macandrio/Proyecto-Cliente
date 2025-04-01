import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    logueado: localStorage.getItem('logueado') === 'true'
  }),

  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('http://localhost:8081/api/login', {
          username,
          password
        })

        this.token = response.data
        this.logueado = true

        localStorage.setItem('token', this.token)
        localStorage.setItem('logueado', 'true')

        return true
      } catch (error) {
        console.error('Error en login:', error)
        return false
      }
    },

    logout() {
      this.token = null
      this.logueado = false
      localStorage.removeItem('token')
      localStorage.removeItem('logueado')
    }
  }
})
