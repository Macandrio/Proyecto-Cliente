<template>
    <div class="container-fluid mt-5 pt-5">
      <h2 class="mb-4 text-center">Mi Horario</h2>
      <div class="table-responsive">
        <table class="table table-bordered text-center align-middle" style="min-width: 1000px;">
          <thead class="table-dark">
            <tr>
              <th>Franja</th>
              <th v-for="dia in diasSemana" :key="dia">{{ dia }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="franja in franjasOrdenadas" :key="franja">
              <td :class="{'bg-warning fw-bold': esRecreo(franja)}">
                {{ franja }}<br />
                <small>{{ franjaHoraria[franja] }}</small>
              </td>
              <td v-for="dia in diasSemana" :key="dia" :class="{'bg-warning': esRecreo(franja)}">
                <template v-if="!esRecreo(franja)">
                  <div v-if="getClase(dia, franja)">
                    Aula: {{ getClase(dia, franja).id_aula }}<br />
                    Asig: {{ getClase(dia, franja).id_asignatura }}
                  </div>
                  <div v-else>-</div>
                </template>
                <template v-else>
                  <strong>RECREO</strong>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  
  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes']

  // Extraer todas las franjas únicas y ordenadas del horario
    const franjasOrdenadas = computed(() => {
    const set = new Set(horario.value.map(h => h.franja))
    return Array.from(set).sort((a, b) => a - b)
    })

  const horario = ref([])

  const franjaHoraria = {
    1: '8:15 - 9:15',
    2: '9:15 - 10:15',
    3: '10:15 - 11:15',
    4: 'RECREO',
    5: '11:45 - 12:45',
    6: '12:45 - 13:45',
    7: '13:45 - 14:45',
    8: '15:00 - 16:00',
    9: '16:00 - 17:00',
    10: '17:00 - 18:00',
    11: 'RECREO',
    12: '18:30 - 19:30',
    13: '19:30 - 20:30',
    14: '20:30 - 21:30'
  }
  
  function esRecreo(franja) {
    return franja === 4 || franja === 11
  }
  
  function getClase(dia, franja) {
    return horario.value.find(h => h.dia === dia && h.franja === franja)
  }
  
//   Llamada al Backend
//   onMounted(async () => {
//     try {
//       const response = await axios.get('http://localhost:8081/api/horario', {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('token')}`
//         }
//       })
//       horario.value = response.data
//     } catch (error) {
//       console.error('Error al cargar el horario:', error)
//     }
//   })

horario.value = [
  { franja: 1, dia: 'Lunes', id_aula: 101, id_asignatura: 12 },
  { franja: 2, dia: 'Lunes', id_aula: 102, id_asignatura: 13 },
  { franja: 3, dia: 'Martes', id_aula: 101, id_asignatura: 15 },
  { franja: 7, dia: 'Jueves', id_aula: 109, id_asignatura: 20 },
  { franja: 9, dia: 'Miércoles', id_aula: 105, id_asignatura: 16 },
  { franja: 11, dia: 'Miércoles', id_aula: null, id_asignatura: null }, // Recreo
  { franja: 12, dia: 'Jueves', id_aula: 109, id_asignatura: 20 },
]

  </script>
  