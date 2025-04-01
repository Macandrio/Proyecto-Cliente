<template>
    <div class="container mt-5 pt-5">
      <h2 class="mb-4">Perfil del Usuario</h2>
      <div class="card p-4 shadow">
        <p><strong>Nombre de usuario:</strong> {{ auth.username }}</p>
        <router-link to="/cambiar-password" class="btn btn-outline-primary mt-2">
          Cambiar contraseña
        </router-link>
        <button class="btn btn-outline-danger mt-2 ms-2" @click="logout">
          Cerrar sesión
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '../stores/auth'
  import { useRouter } from 'vue-router'
  
  const auth = useAuthStore()
  const router = useRouter()
  
  function logout() {
    auth.logout()
    router.push('/login')
  }
  </script>
  