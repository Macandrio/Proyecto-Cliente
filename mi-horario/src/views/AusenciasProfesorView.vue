<template>
    <MenuLateral />
  
    <div class="container mt-4">
      <h2 class="mb-4">Mis Ausencias</h2>
  
      <!-- Formulario para crear nueva ausencia -->
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Registrar nueva ausencia</h5>
          <form @submit.prevent="crearAusencia">
            <div class="row gy-2 gx-3">
              <div class="col-md-4">
                <label for="fecha" class="form-label">Fecha</label>
                <input type="date" v-model="nuevaAusencia.fecha" class="form-control" required />
              </div>
              <div class="col-md-4">
                <label for="horaInicio" class="form-label">Hora inicio</label>
                <input type="time" v-model="nuevaAusencia.horaInicio" class="form-control" />
              </div>
              <div class="col-md-4">
                <label for="horaFin" class="form-label">Hora fin</label>
                <input type="time" v-model="nuevaAusencia.horaFin" class="form-control" />
              </div>
              <div class="col-12">
                <label for="motivo" class="form-label">Motivo</label>
                <input type="text" v-model="nuevaAusencia.motivo" class="form-control" required />
              </div>
              <div class="col-12 d-flex justify-content-end mt-3">
                <button type="submit" class="btn btn-success">Crear ausencia</button>
              </div>
            </div>
          </form>
        </div>
      </div>
  
      <div v-if="ausencias.length === 0" class="alert alert-info">
        No tienes ausencias registradas.
      </div>
  
      <div class="scroll-container">
        <TransitionGroup name="fade" tag="div">
          <div v-for="ausenciaDia in ausenciasOrdenadas" :key="ausenciaDia.fecha" class="mb-4">
            <div class="card">
              <div
                class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <span>{{ formatFecha(ausenciaDia.fecha) }}</span>
                <button class="btn btn-sm btn-danger" @click="eliminarAusencia(ausenciaDia.fecha)">
                  Eliminar
                </button>
              </div>
  
              <div class="table-responsive">
                <table class="table table-bordered table-hover align-middle">
                  <thead class="table-light">
                    <tr>
                      <th scope="col">Hora</th>
                      <th scope="col">Asignatura</th>
                      <th scope="col">Aula</th>
                      <th scope="col">Curso</th>
                      <th scope="col">Motivo</th>
                      <th scope="col">Justificada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="ausencia in ausenciaDia.lstAusenciaFecha" :key="ausencia.id">
                      <td>
                        {{ ausencia.horario.franja.horaInicio }} - {{ ausencia.horario.franja.horaFin }}
                      </td>
                      <td>{{ ausencia.horario.asignatura.nombre }}</td>
                      <td>{{ ausencia.horario.aula?.codigo || '—' }}</td>
                      <td>{{ ausencia.horario.curso?.nombre || '—' }}</td>
                      <td>{{ ausencia.descripcion }}</td>
                      <td>
                        <span class="badge" :class="ausencia.justificada ? 'bg-success' : 'bg-danger'">
                          {{ ausencia.justificada ? 'Sí' : 'No' }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </div>
    </div>
  
    <ModalMensaje :visible="modalVisible" :titulo="modalTitulo" :mensaje="modalMensaje" :tipo="modalTipo"
      @cerrar="modalVisible = false" />
  </template>
  

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import ModalMensaje from '../components/ModalMensaje.vue'
import MenuLateral from '../components/MenuLateral.vue'

// Ausencias y formulario
const ausencias = ref([])
const nuevaAusencia = ref({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: ''
})

// Modal mensaje
const modalVisible = ref(false)
const modalTitulo = ref('')
const modalMensaje = ref('')
const modalTipo = ref('info')

const mostrarModal = (titulo, mensaje, tipo = 'info') => {
    modalTitulo.value = titulo
    modalMensaje.value = mensaje
    modalTipo.value = tipo
    modalVisible.value = true

    // ⏱️ Autocierre después de 2 segundos (solo si no es error)
    if (tipo !== 'error') {
        setTimeout(() => {
            modalVisible.value = false
        }, 4000)
    }
}


// Crear ausencia
const crearAusencia = async () => {
    try {
        const dto = {
            fecha: nuevaAusencia.value.fecha,
            horaInicio: nuevaAusencia.value.horaInicio || null,
            horaFin: nuevaAusencia.value.horaFin || null,
            motivo: nuevaAusencia.value.motivo
        }

        console.log('Enviando DTO:', dto)

        await axios.post('http://localhost:8081/api/ausencias', dto, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })

        mostrarModal('Ausencia creada', 'Ausencia creada correctamente.', 'success')
        nuevaAusencia.value = { fecha: '', horaInicio: '', horaFin: '', motivo: '' }
        cargarAusencias()
    } catch (error) {
        console.error('Error al crear ausencia:', error)
        const mensaje = error.response?.data?.message || 'Error al crear la ausencia.'
        mostrarModal('Error', mensaje, 'error')
    }
}

// Eliminar ausencia
const eliminarAusencia = async (fecha) => {
    const fechaFormateada = new Date(fecha).toISOString().split('T')[0];
    if (!confirm(`¿Estás seguro de eliminar las ausencias del día ${formatFecha(fecha)}?`)) return

    try {
        await axios.delete(`http://localhost:8081/api/ausencias/${fechaFormateada}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        ausencias.value = ausencias.value.filter(a => a.fecha !== fecha)
        mostrarModal('Ausencia eliminada', `Ausencias del día ${formatFecha(fecha)} eliminadas.`, 'success')
    } catch (error) {
        console.error('Error al eliminar las ausencias:', error)
        mostrarModal('Error al eliminar', 'No se pudo eliminar la ausencia.', 'error')
    }
}

// Cargar ausencias
const cargarAusencias = async () => {
    try {
        const response = await axios.get('http://localhost:8081/api/ausencias', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        ausencias.value = response.data
    } catch (error) {
        console.error('Error al cargar las ausencias:', error)
        mostrarModal('Error al cargar ausencias', 'No se pudieron obtener las ausencias.', 'error')
    }
}

// Utilidades
const formatFecha = (fechaISO) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString()
}

const ausenciasOrdenadas = computed(() =>
    [...ausencias.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
)

onMounted(() => {
    cargarAusencias()
})
</script>


<style scoped>
.scroll-container {
    scroll-behavior: smooth;
  max-height: calc(100vh - 300px); /* más espacio por el formulario */
  overflow-y: auto;
  padding-right: 10px;
  padding-bottom: 200px;
}


.card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Animación */
.fade-enter-active,
.fade-leave-active {
    transition: all 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>