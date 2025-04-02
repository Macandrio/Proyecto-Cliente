<template>
  <!-- Overlay de carga centrado -->
  <div
    v-if="cargando"
    class="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75"
    style="z-index: 1050"
  >
    <div class="text-center text-white">
      <div class="spinner-border text-light" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3">Subiendo archivo...</p>
    </div>
  </div>
  
  <div class="pt-5">

    <!-- Botón tipo "bocadillo" arriba a la izquierda -->
     
    <div class="position-fixed top-0 start-0 z-3" style="margin-top: 80px; margin-left: 12px;">
      <button
        class="btn btn-outline-light bg-dark border-0 shadow"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidePanel"
        style="font-size: 1.5rem; padding: 8px 16px;"
      >
        &#9776;
      </button>
    </div>



    <!-- Contenido del home -->
    <div class="container mt-5 pt-5">
      <Horario />
    </div>

    <!-- Offcanvas lateral -->
    <div class="offcanvas offcanvas-start" tabindex="-1" id="sidePanel" aria-labelledby="sidePanelLabel">
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="sidePanelLabel">Menú lateral</h5>
        <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
      </div>
      <div class="offcanvas-body">
        <input
          ref="fileInput"
          type="file"
          @change="handleFileUpload"
          style="display: none"
        />

        <button class="btn btn-primary w-100 mb-2" @click="triggerFileSelect">
          Subir archivo de datos
        </button>
        <button class="btn btn-primary w-100 mb-2">Datos profesorado</button>
        <button class="btn btn-primary w-100 mb-2">Generar partes diario</button>
        <button class="btn btn-primary w-100 mb-2">Ausencia</button>
      </div>
    </div>
  </div>
</template>




<script setup>
import Horario from '../components/Horario.vue'

import { ref } from 'vue'
import axios from 'axios'

const fileInput = ref(null)
const cargando = ref(false)


function triggerFileSelect() {
  fileInput.value.click()
}

function handleFileUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = async () => {
    const base64File = reader.result.split(',')[1]
    cargando.value = true

    try {
      const response = await axios.post(
        'http://localhost:8081/api/horarios/importacion',
        { file: base64File },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      )
      alert('Archivo importado correctamente.')
    } catch (error) {
      console.error('Error al subir archivo:', error)
      alert('Error al importar el archivo.')
    } finally {
      cargando.value = false
    }
  }

  reader.readAsDataURL(file)
}


</script>
