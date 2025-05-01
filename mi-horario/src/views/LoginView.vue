<template>
  <div class="bg-gradient">
    <div class="login-wrapper">
      <div class="card shadow p-4 w-100">
        <!-- Logo -->
        <div class="text-center mb-4">
          <img src="../assets/logo_iespsur.jpeg" alt="logo" style="width: 60px;" />
        </div>

        <form @submit.prevent="login">
          <div class="mb-3">
            <label class="form-label text-muted">Correo Electrónico</label>
            <input v-model="username" type="email" class="form-control" placeholder="carlos.garcia@iespoligonosur.org" required />
          </div>

          <div class="mb-3">
            <label class="form-label text-muted">Contraseña</label>
            <input v-model="password" type="password" class="form-control" placeholder="••••••••" required />
          </div>

          <div v-if="errorLogin" class="text-danger text-center mb-3">
            Credenciales incorrectas
          </div>

          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
      </div>
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
const errorLogin = ref(false)

async function login() {
  errorLogin.value = false
  const ok = await auth.login(username.value, password.value)
  if (ok) {
    router.push('/home')
  } else {
    errorLogin.value = true
  }
}
</script>

<style scoped>

.bg-gradient {
  width: 100%;
  height: 100%;
  background: linear-gradient(160deg, #2c3e50 0%, #4ca1af 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 300px;
}

.login-wrapper {
  max-width: 500px;
  width: 100%;
  padding: 0 16px; /* margen lateral para que no toque los bordes */
}

</style>
