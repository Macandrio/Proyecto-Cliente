<template>
    <div class="container mt-4">
        <h2 class="mb-4">Mis Ausencias</h2>

        <div v-if="ausencias.length === 0" class="alert alert-info">
            No tienes ausencias registradas.
        </div>

        <div class="scroll-container">
            <TransitionGroup name="fade" tag="div">
                <div v-for="ausencia in ausenciasOrdenadas" :key="ausencia.fecha" class="mb-4">
                    <div class="card">
                        <!-- card-header con botón de eliminar -->
                        <div
                            class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <span>{{ formatFecha(ausencia.fecha) }}</span>
                            <button class="btn btn-sm btn-danger" @click="eliminarAusencia(ausencia.fecha)">
                                Eliminar
                            </button>
                        </div>


                        <div class="table-responsive">
                            <table class="table table-bordered table-hover align-middle">
                                <thead class="table-light">
                                    <tr>
                                        <th scope="col">Hora</th>
                                        <th scope="col">Asignaturas</th>
                                        <th scope="col">Aulas</th>
                                        <th scope="col">Cursos</th>
                                        <th scope="col">Motivo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(tramo, index) in ausencia.tramos" :key="index">
                                        <td>{{ tramo.horaInicio }} - {{ tramo.horaFin }}</td>
                                        <td>
                                            <ul class="mb-0 ps-3">
                                                <li v-for="(asig, i) in tramo.asignaturas" :key="i">{{ asig }}</li>
                                            </ul>
                                        </td>
                                        <td>
                                            <ul class="mb-0 ps-3">
                                                <li v-for="(aula, i) in tramo.aulas" :key="i">{{ aula }}</li>
                                            </ul>
                                        </td>
                                        <td>
                                            <ul class="mb-0 ps-3">
                                                <li v-for="(curso, i) in tramo.cursos" :key="i">{{ curso }}</li>
                                            </ul>
                                        </td>

                                        <td>{{ tramo.motivo }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                    </div>
                </div>
            </TransitionGroup>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'

const ausencias = ref([])


onMounted(() => {
    cargarAusencias()
})


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
    }
}

const formatFecha = (fechaISO) => {
    const fecha = new Date(fechaISO)
    return fecha.toLocaleDateString()
}

const ausenciasOrdenadas = computed(() =>
    [...ausencias.value].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
)

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
    } catch (error) {
        console.error('Error al eliminar las ausencias:', error)
    }
}

</script>

<style scoped>
.scroll-container {
    max-height: calc(100vh - 100px);
    /* toda la altura menos header */
    overflow-y: auto;
    padding-right: 10px;
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