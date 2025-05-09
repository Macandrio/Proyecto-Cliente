import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    logueado: localStorage.getItem('logueado') === 'true',
    usuario: JSON.parse(localStorage.getItem('usuario')) || null
  }),

  actions: {
    async login(username, password) {
      try {
        const response = await axios.post('http://52.72.185.156:8081/api/login', {
          username,
          password
        })

        this.token = response.data.token
        this.usuario = response.data.usuario
        this.logueado = true

        localStorage.setItem('token', this.token)
        localStorage.setItem('usuario', JSON.stringify(this.usuario))
        localStorage.setItem('logueado', 'true')

        return true
      } catch (error) {
        console.error('Error en login:', error)
        return false
      }
    },

    logout() {
      this.token = null
      this.usuario = null
      this.logueado = false

      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      localStorage.removeItem('logueado')
    }
  }
})
