<template>
    <div class="mt-3 p-3 border rounded w-100" style="background-color: #f8f9fa;">
      <h6 class="mb-3 text-center text-md-start">
        Modificar usuario para <strong>{{ profesor.nombre }}</strong>
      </h6>
  
      <div class="mb-2">
        <label class="form-label">Email</label>
        <input type="email" class="form-control" v-model="form.email" placeholder="correo@ejemplo.com" />
        <div class="text-danger" v-if="errores.email">{{ errores.email }}</div>
      </div>
  
      <div class="mb-3">
        <label class="form-label">Contraseña (dejar vacío para no cambiarla)</label>
        <input type="password" class="form-control" v-model="form.password" placeholder="••••••" />
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
        <button class="btn btn-primary w-100" :disabled="isLoading" @click="enviar">
          {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
        </button>
        <button class="btn btn-outline-secondary w-100" @click="$emit('cancelar')">Cancelar</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch, toRefs } from 'vue'
  import axios from 'axios'
  
  const props = defineProps({
    profesor: Object,
    errores: Object,
    isLoading: Boolean
  })
  
  const emit = defineEmits(['actualizar', 'cancelar'])
  
  const form = reactive({
    email: props.profesor.usuario.email,
    password: '',
    rol: props.profesor.usuario.rol
  })
  
  async function enviar() {
    emit('actualizar', {
      id: props.profesor.usuario.id,
      nombre: props.profesor.nombre, // para mantener coherencia
      email: form.email,
      contraseña: form.password,
      rol: form.rol
    })
  }
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  