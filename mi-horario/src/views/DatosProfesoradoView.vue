<template>
  <!-- Botón hamburguesa -->
  <div class="position-fixed top-0 start-0 z-3" style="margin-top: 80px; margin-left: 12px;">
    <button class="btn btn-outline-light bg-dark border-0 shadow" type="button" data-bs-toggle="offcanvas"
      data-bs-target="#sidePanel" style="font-size: 1.5rem; padding: 8px 16px;">
      &#9776;
    </button>
  </div>

  <!-- Buscador -->
  <div class="position-fixed top-0 end-0 z-3 p-3 buscador-wrapper" style="margin-top: 80px;">
    <div class="input-group stylish-search">
      <span class="input-group-text bg-light border-0">
        <i class="bi bi-search text-dark"></i>
      </span>
      <input v-model="busqueda" @input="buscarProfesores" type="text" placeholder="Buscar profesor..."
        class="form-control border-0 shadow-none bg-light text-dark" />
    </div>
  </div>

  <!-- Menú lateral -->
  <div class="offcanvas offcanvas-start" tabindex="-1" id="sidePanel" aria-labelledby="sidePanelLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title">Menú lateral</h5>
      <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Cerrar"></button>
    </div>
    <div class="offcanvas-body">
      <input ref="fileInput" type="file" @change="handleFileUpload" style="display: none" />
      <router-link to="/home" class="btn btn-primary w-100 mb-2">Inicio</router-link>
      <button class="btn btn-primary w-100 mb-2" @click="triggerFileSelect">Subir archivo de datos</button>
      <router-link to="/datos-profesorado" class="btn btn-primary w-100 mb-2">Datos profesorado</router-link>
      <button class="btn btn-primary w-100 mb-2">Generar partes diario</button>
      <button class="btn btn-primary w-100 mb-2">Ausencia</button>
    </div>
  </div>

  <!-- Contenido principal -->
  <div class="container mt-5 pt-4">
    <div class="d-flex flex-column align-items-center" style="min-height: 80vh;">
      <div
        class="card tarjeta-horizontal d-flex flex-column flex-md-row align-items-center justify-content-between p-3 shadow-sm mb-3"
        v-for="profesor in resultados" :key="profesor.idProfesor">
        <!-- Imagen -->
        <img :src="profesor.imagen || 'https://i.pinimg.com/236x/66/e6/23/66e6230aa7ce7107f9707493dee0d9ba.jpg'"
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
            <button class="btn btn-warning mb-2 w-100">Modificar usuario</button>
            <button class="btn btn-danger w-100">Eliminar usuario</button>
          </template>
          <template v-else>
            <button class="btn btn-success w-100" @click="mostrarFormularioCrear(profesor.idProfesor)">
              {{ profesorSeleccionado === profesor.idProfesor ? 'Cerrar formulario' : 'Crear usuario' }}
            </button>

            <!-- Formulario desplegable SOLO para el profesor actual -->
            <Transition name="slide-fade">
              <div v-if="profesorSeleccionado === profesor.idProfesor" class="mt-3 p-3 border rounded w-100"
                style="background-color: #f8f9fa;">
                <h6 class="mb-3 text-center text-md-start">
                  Crear usuario para <strong>{{ profesor.nombre }}</strong>
                </h6>

                <div class="mb-2">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" v-model="formularios[profesor.idProfesor].email"
                    placeholder="correo@ejemplo.com" />
                  <div class="text-danger" v-if="erroresFormulario.email">
                    {{ erroresFormulario.email }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Contraseña</label>
                  <input type="password" class="form-control" v-model="formularios[profesor.idProfesor].password"
                    placeholder="••••••" />
                  <div class="text-danger" v-if="erroresFormulario.contraseña">
                    {{ erroresFormulario.contraseña }}
                  </div>
                </div>

                <div class="mb-3">
                  <label class="form-label">Rol</label>
                  <select class="form-select" v-model="formularios[profesor.idProfesor].rol">
                    <option disabled value="">Selecciona un rol</option>
                    <option value="profesor">Profesor</option>
                    <option value="administrador">Equipo directivo</option>
                  </select>
                  <div class="text-danger" v-if="erroresFormulario.rol">
                    {{ erroresFormulario.rol }}
                  </div>
                </div>



                <div class="d-flex gap-2">
                  <button class="btn btn-primary w-100" :disabled="isLoading" @click="guardarUsuario(profesor)">
                    {{ isLoading ? 'Guardando...' : 'Guardar usuario' }}
                  </button>

                  <button class="btn btn-outline-secondary w-100" @click="cancelarFormulario">
                    Cancelar
                  </button>
                </div>
              </div>
            </Transition>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const busqueda = ref('')
const resultados = ref([])
const profesorSeleccionado = ref(null)
const formularios = ref({})
const isLoading = ref(false)
const erroresFormulario = ref({});


async function buscarProfesores() {
  if (busqueda.value.trim().length < 2) {
    obtenerTodosLosProfesores()
    return
  }

  try {
    const response = await axios.get(
      `http://localhost:8081/api/profesores/buscar?nombre=${encodeURIComponent(busqueda.value)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    console.log('🔍 Resultados búsqueda:', response.data)
    resultados.value = response.data
  } catch (error) {
    console.error('Error al buscar profesores:', error)
  }
}

async function obtenerTodosLosProfesores() {
  try {
    const response = await axios.get('http://localhost:8081/api/profesores', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    console.log('📚 Todos los profesores:', response.data)
    resultados.value = response.data
  } catch (error) {
    console.error('Error al obtener profesores:', error)
  }
}

onMounted(() => {
  obtenerTodosLosProfesores()
})

function mostrarFormularioCrear(profesorId) {
  console.log('📌 ID recibido:', profesorId)

  if (profesorSeleccionado.value === profesorId) {
    profesorSeleccionado.value = null
  } else {
    profesorSeleccionado.value = profesorId

    // SIEMPRE reinicia los campos al abrir
    formularios.value[profesorId] = {
      email: '',
      password: ''
    }
  }
}

function cancelarFormulario() {
  profesorSeleccionado.value = null
}

async function guardarUsuario(profesor) {
  const datos = formularios.value[profesor.idProfesor];
  erroresFormulario.value = {}; // limpiar errores previos

  if (!datos?.email || !datos?.password || !datos?.rol) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  const payload = {
    nombre: profesor.nombre,
    email: datos.email,
    contraseña: datos.password,
    rol: datos.rol
  };

  isLoading.value = true;

  try {
    await axios.post(`http://localhost:8081/api/usuarios/crear-con-profesor/${profesor.idProfesor}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });

    alert(`✅ Usuario creado y vinculado al profesor ${profesor.nombre}`);
    profesorSeleccionado.value = null;
    obtenerTodosLosProfesores();
  } catch (error) {
    isLoading.value = false;

    // Si el servidor devolvió errores de validación
    if (error.response && error.response.status === 400 && typeof error.response.data === 'object') {
      erroresFormulario.value = error.response.data;
    } else if (error.response && error.response.status === 404) {
      alert('❌ Profesor no encontrado.');
    } else {
      alert('❌ Error al crear usuario.');
    }

  } finally {
    isLoading.value = false;
  }
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

@media (max-width: 576px) {
  .container {
    margin-top: 160px !important;
  }
}

.stylish-search {
  border-radius: 40px;
  overflow: hidden;
  background-color: #f8f9fa;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.stylish-search:focus-within {
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
}

.buscador-wrapper {
  width: 350px;
}

.stylish-search input::placeholder {
  color: #6c757d;
  font-style: italic;
}

@media (max-width: 576px) {
  .buscador-wrapper {
    width: 90%;
    right: 0;
    left: 0;
    margin: auto;
  }
}

/* Transición slide-fade */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
