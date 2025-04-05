<template>
    <div class="position-fixed top-0 end-0 z-3 p-3 buscador-wrapper" style="margin-top: 80px;">
      <div class="input-group stylish-search">
        <span class="input-group-text bg-light border-0">
          <i class="bi bi-search text-dark"></i>
        </span>
        <input
          v-model="valorBusqueda"
          @input="emitirBusqueda"
          type="text"
          placeholder="Buscar profesor..."
          class="form-control border-0 shadow-none bg-light text-dark"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
  const valorBusqueda = ref('')
  
  const emit = defineEmits(['buscar'])
  
  function emitirBusqueda() {
    emit('buscar', valorBusqueda.value)
  }

  </script>
  
  <style scoped>
  .stylish-search {
    border-radius: 40px;
    overflow: hidden;
    background-color: #f8f9fa;
    box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
  }
  
  .stylish-search:focus-within {
    box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
  }
  
  .buscador-wrapper {
    width: 350px;
  }
  
  .stylish-search input::placeholder {
    color: #6c757d;
    font-style: italic;
  }
  
  @media (max-width: 576px) {
    .buscador-wrapper {
      width: 90%;
      right: 0;
      left: 0;
      margin: auto;
    }
  }
  </style>
  