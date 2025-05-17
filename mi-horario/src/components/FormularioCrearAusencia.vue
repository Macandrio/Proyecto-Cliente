<template>
    <div class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Registrar nueva ausencia</h5>
        <form @submit.prevent="crearAusencia">
          <div class="row gy-2 gx-3">
            <div class="col-md-4">
              <label class="form-label">Fecha</label>
              <input type="date" v-model="nuevaAusencia.fecha" class="form-control" required />
            </div>
            <div class="col-md-4">
              <label class="form-label">Hora inicio</label>
              <input type="time" v-model="nuevaAusencia.horaInicio" class="form-control" />
            </div>
            <div class="col-md-4">
              <label class="form-label">Hora fin</label>
              <input type="time" v-model="nuevaAusencia.horaFin" class="form-control" />
            </div>
            <div class="col-12">
              <label class="form-label">Motivo</label>
              <input type="text" v-model="nuevaAusencia.motivo" class="form-control" required />
            </div>
            <div class="col-12 d-flex justify-content-end mt-3">
              <button type="submit" class="btn btn-success">Crear ausencia</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from 'axios'
  
  const emit = defineEmits(['ausenciaCreada', 'error'])


  const props = defineProps({
    idProfesor: Number
  })
  
  const nuevaAusencia = ref({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: ''
  })
  
  async function crearAusencia() {
    try {
      const payload = {
        fecha: nuevaAusencia.value.fecha,
        horaInicio: nuevaAusencia.value.horaInicio,
        horaFin: nuevaAusencia.value.horaFin,
        motivo: nuevaAusencia.value.motivo,
        idProfesor: props.idProfesor
      }
  
      await axios.post('http://52.72.185.156:8081/api/ausencias', payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
  
      emit('ausenciaCreada')
      // Limpiar formulario si se desea
      nuevaAusencia.value = { fecha: '', horaInicio: '', horaFin: '', motivo: '' }
  
    } catch (error) {
      console.error('Error al crear ausencia:', error)
      emit('error', 'No se pudo crear la ausencia.')
    }
  }
  </script>
  