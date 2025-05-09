<template>
  <div class="container-fluid pt-5 mb-5" style="margin-top: 100px;">
    <!-- Vista de escritorio -->
    <div class="d-none d-md-block">
      <table class="table table-bordered text-start align-middle w-100">
        <thead class="table-dark">
          <tr>
            <th style="width: 120px;">Franja</th>
            <th v-for="dia in diasSemana" :key="dia" style="width: 150px;">{{ dia }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="franja in franjasOrdenadas" :key="franja.horaInicio">
            <td class="bg-light fw-bold" style="padding-left: 8px;">
              {{ franja.horaInicio }} - {{ franja.horaFin }}
            </td>
            <td v-for="dia in diasSemana" :key="dia" style="height: 80px; padding-left: 8px;"
              :class="{ 'bg-light': getClase(dia, franja) }">
              <div v-if="getClase(dia, franja)">
                Aula: {{ getClase(dia, franja).aula?.codigo || '-' }}<br />
                Curso: {{ getClase(dia, franja).curso?.nombre || '-' }}<br />
                Asig: {{ getClase(dia, franja).asignatura?.nombre || '-' }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Vista móvil tipo carrusel -->
    <div class="d-md-none text-center">
      <div class="mb-3">
        <button @click="diaAnterior" class="btn btn-outline-secondary me-2" :disabled="diaActualIndex === 0">←</button>
        <strong>{{ diasSemana[diaActualIndex] }}</strong>
        <button @click="diaSiguiente" class="btn btn-outline-secondary ms-2"
          :disabled="diaActualIndex === diasSemana.length - 1">→</button>
      </div>
      <table class="table table-bordered text-start align-middle w-100">
        <thead class="table-dark">
          <tr>
            <th style="width: 120px;">Franja</th>
            <th style="width: 100%">{{ diasSemana[diaActualIndex] }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="franja in franjasOrdenadas" :key="franja.horaInicio">
            <td class="bg-light fw-bold" style="padding-left: 8px;">
              {{ franja.horaInicio }} - {{ franja.horaFin }}
            </td>
            <td style="height: 80px; padding-left: 8px;"
              :class="{ 'bg-light': getClase(diasSemana[diaActualIndex], franja) }">
              <div v-if="getClase(diasSemana[diaActualIndex], franja)">
                Aula: {{ getClase(diasSemana[diaActualIndex], franja).aula?.codigo || '-' }}<br />
                Curso: {{ getClase(diasSemana[diaActualIndex], franja).curso?.nombre || '-' }}<br />
                Asig: {{ getClase(diasSemana[diaActualIndex], franja).asignatura?.nombre || '-' }}
              </div>
              <div v-else>-</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']
const diaActualIndex = ref(0)
const horario = ref([])
const route = useRoute()
const idProfesor = route.params.id || null


const franjasOrdenadas = computed(() => {
  const mapa = new Map()
  for (const h of horario.value) {
    const clave = h.franja.horaInicio
    if (!mapa.has(clave)) {
      mapa.set(clave, h.franja)
    }
  }
  return Array.from(mapa.values()).sort((a, b) =>
    a.horaInicio.localeCompare(b.horaInicio)
  )
})

function getClase(dia, franja) {
  return horario.value.find(
    h => h.dia === dia && h.franja.horaInicio === franja.horaInicio
  )
}

function diaAnterior() {
  if (diaActualIndex.value > 0) diaActualIndex.value--
}

function diaSiguiente() {
  if (diaActualIndex.value < diasSemana.length - 1) diaActualIndex.value++
}

onMounted(async () => {
  try {
    const url = idProfesor
      ? `http://52.72.185.156:8081/api/horarios?idProfesor=${idProfesor}`
      : 'http://52.72.185.156:8081/api/horarios'

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    const diaMap = {
      L: 'Lunes',
      M: 'Martes',
      X: 'Miércoles',
      J: 'Jueves',
      V: 'Viernes'
    }

    horario.value = response.data.map(item => ({
      ...item,
      dia: diaMap[item.dia] || item.dia
    }))
  } catch (error) {
    console.error('Error al cargar el horario:', error)
  }
})
</script>
