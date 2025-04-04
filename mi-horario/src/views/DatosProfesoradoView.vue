<template>
  <!-- Botón hamburguesa -->
  <div class="position-fixed top-0 start-0 z-3" style="margin-top: 80px; margin-left: 12px;">
    <button class="btn btn-outline-light bg-dark border-0 shadow" type="button" data-bs-toggle="offcanvas"
      data-bs-target="#sidePanel" style="font-size: 1.5rem; padding: 8px 16px;">
      &#9776;
    </button>
  </div>

  <!-- Buscador -->
  <div class="position-fixed top-0 end-0 z-3 p-3" style="margin-top: 80px;">
    <div class="input-group" style="width: 300px;">
      <span class="input-group-text"><i class="bi bi-search"></i></span>
      <input
        v-model="busqueda"
        @input="buscarProfesores"
        type="text"
        placeholder="Buscar profesor..."
        class="form-control"
      />
    </div>
  </div>

  <!-- Menú lateral -->
  <div class="offcanvas offcanvas-start" tabindex="-1" id="sidePanel" aria-labelledby="sidePanelLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Menú lateral</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
    </div>
    <div class="offcanvas-body">
      <input ref="fileInput" type="file" @change="handleFileUpload" style="display: none" />
      <router-link to="/home" class="btn btn-primary w-100 mb-2">Inicio</router-link>
      <button class="btn btn-primary w-100 mb-2" @click="triggerFileSelect">Subir archivo de datos</button>
      <router-link to="/datos-profesorado" class="btn btn-primary w-100 mb-2">Datos profesorado</router-link>
      <button class="btn btn-primary w-100 mb-2">Generar partes diario</button>
      <button class="btn btn-primary w-100 mb-2">Ausencia</button>
    </div>
  </div>

  <!-- Contenido principal -->
  <div class="container mt-5 pt-4">
    <div class="d-flex flex-column align-items-center" style="min-height: 80vh;">
      <div
        class="card tarjeta-horizontal d-flex flex-column flex-md-row align-items-center justify-content-between p-3 shadow-sm mb-3"
        v-for="profesor in resultados"
        :key="profesor.id"
      >
        <!-- Imagen -->
        <img
          :src="profesor.imagen || 'https://i.pinimg.com/236x/66/e6/23/66e6230aa7ce7107f9707493dee0d9ba.jpg'"
          alt="Foto del profesor"
          class="img-fluid rounded"
          style="height: 100px; width: 100px; object-fit: cover;"
        />

        <!-- Info -->
        <div class="flex-grow-1 ms-md-3 mt-3 mt-md-0 text-center text-md-start">
          <h5 class="mb-1">{{ profesor.nombre }}</h5>
          <p class="mb-0 text-muted" v-if="profesor.departamento">{{ profesor.departamento }}</p>
          <p class="mb-0" v-if="profesor.usuario"><strong>Email:</strong> {{ profesor.usuario.email }}</p>
        </div>

        <!-- Botones -->
        <div class="d-flex flex-column align-items-center align-items-md-end mt-3 mt-md-0">
          <template v-if="profesor.usuario">
            <button class="btn btn-warning mb-2 w-100">Modificar usuario</button>
            <button class="btn btn-danger w-100">Eliminar usuario</button>
          </template>
          <template v-else>
            <button class="btn btn-success w-100">Crear usuario</button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const busqueda = ref('')
const resultados = ref([])

async function buscarProfesores() {
  if (busqueda.value.trim().length < 2) {
    resultados.value = []
    return
  }

  try {
    const response = await axios.get(
      `http://localhost:8081/api/profesores/buscar?nombre=${encodeURIComponent(busqueda.value)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    resultados.value = response.data
  } catch (error) {
    console.error('Error al buscar profesores:', error)
  }
}
</script>

<style scoped>
/* Tarjeta horizontal */
.tarjeta-horizontal {
  width: 750px;
  max-width: 900px;
  min-height: 120px;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}

.tarjeta-horizontal:hover {
  transform: scale(1.01);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}


/* Márgenes en móvil */
@media (max-width: 576px) {
  .container {
    margin-top: 160px !important;
  }
}
</style>
