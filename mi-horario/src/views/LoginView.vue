<template>
    <div class="container d-flex align-items-center justify-content-center min-vh-100">
      <div class="card p-4 shadow" style="max-width: 400px; width: 100%;">
        <h1 class="text-center mb-4">🕒 Mi Horario</h1>
        <form @submit.prevent="login">
          <div class="mb-3">
            <input v-model="username" type="text" class="form-control" placeholder="Usuario" required />
          </div>
          <div class="mb-3">
            <input v-model="password" type="password" class="form-control" placeholder="Contraseña" required />
          </div>
          <button class="btn btn-primary w-100" type="submit">Entrar</button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  
  const router = useRouter()
  const auth = useAuthStore()
  
  const username = ref('')
  const password = ref('')
  
  async function login() {
    const ok = await auth.login(username.value, password.value)
    if (ok) {
      router.push('/home')
    } else {
      alert('Credenciales incorrectas')
    }
  }
  </script>
  