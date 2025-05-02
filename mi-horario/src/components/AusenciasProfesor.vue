<!-- src/components/AusenciasProfesor.vue -->
<template>
  <div>
    <h4 class="mb-3">Ausencias del profesor</h4>

    <div v-if="ausencias.length === 0" class="alert alert-info">
      No hay ausencias registradas para este profesor.
    </div>

    <div v-else class="scroll-container">
      <div v-for="ausenciaDia in ausenciasOrdenadas" :key="ausenciaDia.fecha" class="mb-4">
        <div class="card">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <span>{{ formatFecha(ausenciaDia.fecha) }}</span>
            <button class="btn btn-sm btn-danger" @click="eliminarAusencia({ fecha: ausenciaDia.fecha })">
              Eliminar
            </button>
          </div>

          <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th>Hora</th>
                  <th>Asignatura</th>
                  <th>Aula</th>
                  <th>Curso</th>
                  <th>Motivo</th>
                  <th>Justificada</th>
                  <th>Eliminar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ausencia in ausenciaDia.lstAusenciaFecha" :key="ausencia.id">
                  <td>{{ ausencia.horario.franja.horaInicio }} - {{ ausencia.horario.franja.horaFin }}</td>
                  <td>{{ ausencia.horario.asignatura.nombre }}</td>
                  <td>{{ ausencia.horario.aula?.codigo || '—' }}</td>
                  <td>{{ ausencia.horario.curso?.nombre || '—' }}</td>
                  <td>{{ ausencia.descripcion }}</td>
                  <td>
                    <span class="badge" :class="ausencia.justificada ? 'bg-success' : 'bg-danger'">
                      {{ ausencia.justificada ? 'Sí' : 'No' }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-danger" @click="eliminarAusencia({ id: ausencia.id })">
                      🗑️
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalMensaje
  :visible="modal.visible"
  :titulo="modal.titulo"
  :mensaje="modal.mensaje"
  :tipo="modal.tipo"
  @cerrar="modal.visible = false"
/>

</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import ModalMensaje from './ModalMensaje.vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  idUsuario: {
    type: Number,
    required: true
  }
})
const route = useRoute()
const idProfesor = route.params.id

const ausencias = ref([])

onMounted(() => {
  cargarAusencias()
})

async function cargarAusencias() {
  try {
    console.log('🔍 ID de usuario que se enviará al backend:', props.idUsuario) // 👈 AÑADIDO

    const response = await axios.get(`http://localhost:8081/api/ausencias?idusuario=${props.idUsuario}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    ausencias.value = response.data
  } catch (error) {
    console.error('Error al cargar ausencias del profesor:', error)
  }
}


const ausenciasOrdenadas = computed(() =>
  [...ausencias.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
)

function formatFecha(fechaISO) {
  return new Date(fechaISO).toLocaleDateString()
}

// Eliminar ausencia
const eliminarAusencia = async ({ id = null, fecha = null }) => {
  let mensajeConfirmacion = ''
  console.log(id, fecha)
  if (id) {
    mensajeConfirmacion = '¿Estás seguro de eliminar esta franja de ausencia?'
  } else if (fecha) {
    mensajeConfirmacion = `¿Estás seguro de eliminar las ausencias del día ${formatFecha(fecha)}?`
  } else {
    console.warn('❌ Se necesita al menos un ID o una fecha para eliminar.')
    return
  }

  if (!confirm(mensajeConfirmacion)) return

  try {
    const payload = {}
    if (id) payload.id = id
    if (fecha) {
      payload.fecha = new Date(fecha).toISOString().split('T')[0]
      payload.idProfesor = idProfesor
      console.log(payload)
    }

    await axios.delete('http://localhost:8081/api/ausencias', {
      data: payload,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    await cargarAusencias()

    mostrarModal('Ausencia eliminada', 'Se ha eliminado correctamente.', 'success')
  } catch (error) {
    console.error('Error al eliminar ausencia:', error)
    mostrarModal('Error al eliminar', 'No se pudo eliminar la ausencia.', 'error')
  }
}


const modal = ref({
  visible: false,
  titulo: '',
  mensaje: '',
  tipo: 'info'
})

function mostrarModal(titulo, mensaje, tipo = 'info') {
  modal.value = {
    visible: true,
    titulo,
    mensaje,
    tipo
  }

  if (tipo !== 'error') {
    setTimeout(() => {
      modal.value.visible = false
    }, 4000)
  }
}

</script>

<style scoped>
.scroll-container {
  max-height: 60vh;
  overflow-y: auto;
}

.card {
  border-radius: 10px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
}
</style>