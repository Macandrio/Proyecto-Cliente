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
      <button class="btn btn-primary w-100" :disabled="isLoading" @click="enviar">
        {{ isLoading ? 'Guardando...' : 'Guardar cambios' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'

const props = defineProps({
  profesor: Object,   // Recibe el objeto completo del profesor
  errores: Object,
  isLoading: Boolean
})

const emit = defineEmits(['actualizar', 'cancelar'])

const form = reactive({
  email: props.profesor?.usuario?.email || '',
  password: '',  // La contraseña puede ser opcional
  rol: props.profesor?.usuario?.rol || ''
})

// Usar un watcher para actualizar el formulario cada vez que cambie el profesor
watch(() => props.profesor, (nuevoProfesor) => {
  console.log("Nuevo profesor recibido:", nuevoProfesor);
  form.email = nuevoProfesor?.usuario?.email || '';  // Actualiza el email con los nuevos valores
  form.password = '';  // Puedes limpiar la contraseña si es necesario
  form.rol = nuevoProfesor?.usuario?.rol || '';  // Actualiza el rol
}, { immediate: true });  // Con 'immediate: true', se ejecutará también en la inicialización

function enviar() {
  // Si la contraseña está vacía, se asegura de que se envíe una cadena vacía
  const passwordToSend = form.password || "";  // Si la contraseña está vacía, se envía una cadena vacía

  console.log("Datos que se enviarán al padre:", {
    idProfesor: props.profesor.idProfesor,
    nombre: props.profesor.nombre,  // Nombre incluido en el payload
    email: form.email,
    password: passwordToSend,  // Se envía la contraseña vacía si está vacía
    rol: form.rol
  });

  // Emitir los datos al padre
  emit('actualizar', {
    idProfesor: props.profesor.idProfesor,
    nombre: props.profesor.nombre,  // Pasar el nombre al padre
    email: form.email,
    password: passwordToSend,  // Enviar la contraseña vacía si está vacía
    rol: form.rol
  });
}

</script>



