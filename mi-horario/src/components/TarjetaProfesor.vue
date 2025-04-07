<template>
  <div class="card tarjeta-horizontal d-flex flex-column flex-md-row align-items-center justify-content-between p-3 shadow-sm mb-3">
    <!-- Imagen -->
    <img :src="profesor.imagen || 'https://img.freepik.com/vector-premium/icono-usuario-avatar-perfil-usuario-icono-persona-imagen-perfil-silueta-neutral-genero-adecuado_697711-1132.jpg'"
      alt="Foto del profesor" class="img-fluid rounded" style="height: 100px; width: 100px; object-fit: cover;" />

    <!-- Info -->
    <div class="flex-grow-1 ms-md-3 mt-3 mt-md-0 text-center text-md-start">
      <h5 class="mb-1">{{ profesor.nombre }}</h5>
      <p class="mb-0 text-muted" v-if="profesor.departamento">{{ profesor.departamento }}</p>
      <p class="mb-0" v-if="profesor.usuario"><strong>Email:</strong> {{ profesor.usuario.email }}</p>
    </div>

    <!-- Botones -->
    <div class="d-flex flex-column align-items-center align-items-md-end mt-3 mt-md-0">
      <template v-if="profesor.usuario">
        <button class="btn btn-warning mb-2 w-100" 
          @click="handleToggleFormulario(profesor.idProfesor, 'edit')">
          {{ profesorSeleccionado === profesor.idProfesor ? 'Cerrar formulario' : 'Modificar usuario' }}
        </button>
        <button class="btn btn-danger w-100" @click="$emit('eliminarUsuario', profesor)">
          Eliminar usuario
        </button>
      </template>

      <template v-else>
        <button class="btn btn-success w-100" 
          @click="handleToggleFormulario(profesor.idProfesor, 'create')">
          {{ profesorSeleccionado === profesor.idProfesor ? 'Cerrar formulario' : 'Crear usuario' }}
        </button>
      </template>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  profesor: Object,
  profesorSeleccionado: Number,
  formulario: Object,
  errores: Object,
  isLoading: Boolean
})

const emit = defineEmits([
  'toggleFormulario',  // Para abrir o cerrar el formulario
  'guardarUsuario',    // Para guardar el usuario
  'cancelarFormulario',// Para cancelar la acción
  'eliminarUsuario',   // Para eliminar el usuario
  'modificarUsuario'   // Para modificar el usuario
])

// Manejo del clic en los botones "Crear" o "Modificar" usuario
function handleToggleFormulario(profesorId, action) {
  console.log('Botón clickeado:', { profesorId, action })  // Ver qué datos se están pasando
  // Emitimos el evento con el objeto { profesorId, action }
  emit('toggleFormulario', { profesorId, action })  // Aquí usamos `emit` de `defineEmits`
}

</script>

<style scoped>
.tarjeta-horizontal {
  width: 750px;
  max-width: 900px;
  min-height: 120px;
  border-radius: 12px;
  transition: all 0.2s ease-in-out;
}

.tarjeta-horizontal:hover {
  transform: scale(1.01);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
}
</style>
