<template>
  <div
    class="card tarjeta-horizontal d-flex flex-column flex-md-row align-items-center justify-content-between p-3 shadow-sm mb-3">
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
        <button class="btn btn-warning mb-2 w-100" @click="$emit('toggleFormulario', profesor.idProfesor)">
          {{ profesorSeleccionado === profesor.idProfesor ? 'Cerrar formulario' : 'Modificar usuario' }}
        </button>
        <button class="btn btn-danger w-100" @click="$emit('eliminarUsuario', profesor)">
          Eliminar usuario
        </button>

        <FormularioEditarUsuario
          v-if="profesorSeleccionado === profesor.idProfesor"
          :profesor="profesor"
          :errores="errores"
          :isLoading="isLoading"
          @actualizar="$emit('modificarUsuario', $event)"
          @cancelar="$emit('cancelarFormulario')"
        />
      </template>

      <template v-else>
        <button class="btn btn-success w-100" @click="$emit('toggleFormulario', profesor.idProfesor)">
          {{ profesorSeleccionado === profesor.idProfesor ? 'Cerrar formulario' : 'Crear usuario' }}
        </button>

        <Transition name="slide-fade">
          <div v-if="profesorSeleccionado === profesor.idProfesor" class="mt-3 p-3 border rounded w-100"
            style="background-color: #f8f9fa;">
            <h6 class="mb-3 text-center text-md-start">
              Crear usuario para <strong>{{ profesor.nombre }}</strong>
            </h6>

            <div class="mb-2">
              <label class="form-label">Email</label>
              <input type="email" class="form-control" v-model="formulario.email" placeholder="correo@ejemplo.com" />
              <div class="text-danger" v-if="errores.email">{{ errores.email }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Contraseña</label>
              <input type="password" class="form-control" v-model="formulario.password" placeholder="••••••" />
              <div class="text-danger" v-if="errores.contraseña">{{ errores.contraseña }}</div>
            </div>

            <div class="mb-3">
              <label class="form-label">Rol</label>
              <select class="form-select" v-model="formulario.rol">
                <option disabled value="">Selecciona un rol</option>
                <option value="profesor">Profesor</option>
                <option value="administrador">Equipo directivo</option>
              </select>
              <div class="text-danger" v-if="errores.rol">{{ errores.rol }}</div>
            </div>

            <div class="d-flex gap-2">
              <button class="btn btn-primary w-100" :disabled="isLoading" @click="$emit('guardarUsuario', profesor)">
                {{ isLoading ? 'Guardando...' : 'Guardar usuario' }}
              </button>

              <button class="btn btn-outline-secondary w-100" @click="$emit('cancelarFormulario')">
                Cancelar
              </button>
            </div>
          </div>
        </Transition>
      </template>
    </div>
  </div>
</template>

<script setup>
import FormularioEditarUsuario from './FormularioEditarUsuario.vue'

defineProps({
  profesor: Object,
  profesorSeleccionado: Number,
  formulario: Object,
  errores: Object,
  isLoading: Boolean
})

defineEmits([
  'toggleFormulario',
  'guardarUsuario',
  'cancelarFormulario',
  'eliminarUsuario',
  'modificarUsuario'
])
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