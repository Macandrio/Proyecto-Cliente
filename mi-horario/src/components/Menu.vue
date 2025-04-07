<!-- src/components/Menu.vue -->
<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top w-100 shadow">
    <div class="container-fluid">

      <!-- Logo -->
      <router-link to="/home" class="navbar-brand d-flex align-items-center">
        <img :src="logo" alt="Logo" height="36" class="me-2" />

        <!-- Título completo en escritorio -->
        <span class="d-none d-lg-inline titulo-app">Horario IES Polígono Sur</span>

        <!-- Título reducido en móvil -->
        <span class="d-inline d-lg-none titulo-app">Polígono Sur</span>
      </router-link>


      <router-link to="/perfil" class="btn btn-outline-light ms-auto d-lg-none fw-bold nombre-usuario">
        👤 {{ auth.usuario.nombre }}
      </router-link>




      <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
        <ul class="navbar-nav">

          <!-- DROPDOWN DE PERFIL -->
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" id="perfilDropdown" role="button" aria-expanded="false">
              👤 {{ auth.usuario.nombre }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="perfilDropdown">
              <li>
                Registrar Usuario
              </li>
              <li>
                Modificar Usuario
              </li>
              <li>
                🔐 Cambiar contraseña
              </li>

              <li>
                <hr class="dropdown-divider" />
              </li>
              <li>
                <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                  🚪 Cerrar sesión
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logo from '../assets/logo_iespsur.jpeg'


const router = useRouter()
const auth = useAuthStore()

const nombreUsuario = auth.username || 'Usuario'

function logout() {
  auth.logout()
  router.push('/login')
}
</script>


<style scoped>
/* Mostrar dropdown al pasar el mouse (solo en escritorio) */
@media (min-width: 992px) {
  .nav-item.dropdown:hover .dropdown-menu {
    display: block;
    margin-top: 0;
    transform: translateX(-105px);
    /* ajusta según el ancho */
    min-width: 220px;
    /* ✅ hace el menú más ancho */
    padding: 10px;
  }
}

/* Centrar el dropdown en móviles */
.dropdown-menu {
  transition: all 0.2s ease-in-out;
  left: 0 !important;
  right: 0 !important;
  margin: auto;
  width: auto;
  max-width: 250px;
  /* opcional: máximo en móvil */
}

/* Título más pequeño en pantallas pequeñas */
.titulo-app {
  font-size: 1rem;
  white-space: nowrap;
}

/* Nombre de usuario más pequeño en móvil y truncado */
.nombre-usuario {
  font-size: 0.85rem;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Logo más pequeño si quieres más espacio */
.navbar-brand img {
  height: 32px;
}

/* Ajustes generales de navbar */
.navbar {
  padding-left: 8px;
  padding-right: 8px;
}
</style>
