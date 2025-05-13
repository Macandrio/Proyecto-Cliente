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
            <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" id="perfilDropdown" role="button"
              data-bs-toggle="dropdown" aria-expanded="false">
              <!-- Si hay imagen de perfil -->
              <img :src="imagenPerfil || imagenPorDefecto" class="rounded-circle me-2"
                style="width: 32px; height: 32px; object-fit: cover;" />




              {{ auth.usuario.nombre }}
            </a>
            <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="perfilDropdown">
              <li>
                <label for="inputFotoPerfil" class="dropdown-item" style="cursor: pointer;">
                  👤 Subir foto de Perfil
                </label>
                <input id="inputFotoPerfil" type="file" accept="image/*" @change="subirImagen" style="display: none;" />
              </li>
              <li>🔐 Cambiar contraseña</li>
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
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logo from '../assets/logo_iespsur.jpeg'
import { ref, onMounted } from 'vue'

const imagenPerfil = ref(null)



const router = useRouter()
const auth = useAuthStore()

const nombreUsuario = auth.username || 'Usuario'

onMounted(() => {
  cargarImagenConToken()
})


function logout() {
  auth.logout()
  router.push('/login')
}

function subirImagen(event) {
  const archivo = event.target.files[0]
  if (!archivo) return

  const formData = new FormData()
  formData.append('imagen', archivo)

  axios.post(
    `http://localhost:8081/api/usuarios/${auth.usuario.id}/imagen`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${auth.token}`
      }
    }
  ).then(() => {
    alert('Imagen subida con éxito')
    cargarImagenConToken() // ✅ refresca imagen
  }).catch(err => {
    console.error(err)
    alert('Error al subir la imagen')
  })
}

const imagenPorDefecto = 'https://img.freepik.com/vector-premium/icono-usuario-avatar-perfil-usuario-icono-persona-imagen-perfil-silueta-neutral-genero-adecuado_697711-1132.jpg'


async function cargarImagenConToken() {
  try {
    const response = await axios.get(
      `http://localhost:8081/api/usuarios/${auth.usuario.id}/imagen`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`
        },
        responseType: 'arraybuffer',
        validateStatus: status => status === 200 // solo acepta 200 como válido
      }
    )

    const tipo = response.headers['content-type'] || 'image/jpeg'
    const base64 = btoa(
      new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )
    imagenPerfil.value = `data:${tipo};base64,${base64}`
  } catch (error) {
    console.warn('No se encontró imagen. Usando imagen por defecto.')
    imagenPerfil.value = imagenPorDefecto
  }
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
  left: 100px !important;
  right: 0 !important;
  margin: auto;
  width: auto;
  max-width: 300px;
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
