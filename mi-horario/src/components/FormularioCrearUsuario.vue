<template>
    <div class="formulario-container mt-3 p-3 border rounded w-100" style="background-color: #f8f9fa;">
      <h6 class="mb-3 text-center text-md-start">
        Crear usuario para <strong>{{ profesor.nombre }}</strong>
      </h6>
    
      <div class="mb-2">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model="form.email" placeholder="correo@ejemplo.com" />
        <div class="text-danger" v-if="errores.email">{{ errores.email }}</div>
      </div>
    
      <div class="mb-3">
        <label class="form-label">Contraseña</label>
        <input type="password" class="form-control" v-model="form.password" placeholder="••••••" />
        <div class="text-danger" v-if="errores.contraseña">{{ errores.contraseña }}</div>
      </div>
    
      <div class="mb-3">
        <label class="form-label">Rol</label>
        <select class="form-select" v-model="form.rol">
          <option disabled value="">Selecciona un rol</option>
          <option value="profesor">Profesor</option>
          <option value="administrador">Equipo directivo</option>
        </select>
        <div class="text-danger" v-if="errores.rol">{{ errores.rol }}</div>
      </div>
    
      <div class="d-flex gap-2">
        <button class="btn btn-primary w-100" :disabled="isLoading" @click="guardar">
          {{ isLoading ? 'Guardando...' : 'Guardar usuario' }}
        </button>

      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive } from 'vue'
  
  const props = defineProps({
    profesor: Object,
    errores: Object,
    isLoading: Boolean
  })
  
  const emit = defineEmits(['guardar', 'cancelar'])
  
  const form = reactive({
    email: '',
    password: '',
    rol: ''
  })
  
  function guardar() {
  // Imprimir los datos que se están enviando al padre
  console.log('Datos que se envían al padre:', {
    idProfesor: props.profesor.idProfesor,
    nombre: props.profesor.nombre,
    email: form.email,
    password: form.password,
    rol: form.rol
  });

  // Emitir los datos hacia el componente padre
  emit('guardar', {
    idProfesor: props.profesor.idProfesor,
    nombre: props.profesor.nombre,
    email: form.email,
    password: form.password,
    rol: form.rol
  })
}


  </script>
  
  
  <style scoped>
  /* Estilos para el contenedor del formulario */
  .formulario-container {
    margin-top: 20px; /* Ajuste del margen superior */
    padding: 20px;
    background-color: #f8f9fa;
    border-radius: 8px;
    z-index: 10;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Añadir sombra para resaltar */
  }
  
  /* Estilo opcional para los campos */
  .form-control {
    border-radius: 4px;
  }
  
  .text-danger {
    font-size: 0.875rem;
  }
  
  .btn {
    border-radius: 4px;
    padding: 10px;
  }
  </style>
  