<template>
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
        <button class="btn btn-primary w-100 mb-2">Subir archivo de datos</button>
        <button class="btn btn-primary w-100 mb-2">Datos profesorado</button>
        <button class="btn btn-primary w-100 mb-2">Generar partes diario</button>
        <button class="btn btn-primary w-100 mb-2">Ausencia</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import Horario from '../components/Horario.vue'
</script>
