<template>
  <MenuLateral />

  <BuscadorProfesores @buscar="buscarProfesoresDesdeEvento" />

  <div class="container mt-5 pt-4">
    <div class="d-flex flex-column align-items-center" style="min-height: 80vh;">
      <TarjetaProfesor v-for="profesor in resultados" :key="profesor.idProfesor" :profesor="profesor"
        :profesorSeleccionado="profesorSeleccionado" :formulario="formularios[profesor.idProfesor] || {}"
        :errores="erroresFormulario" :isLoading="isLoading" @toggleFormulario="mostrarFormularioCrear"
        @guardarUsuario="guardarUsuario" @cancelarFormulario="cancelarFormulario" @eliminarUsuario="eliminarUsuario" @modificarUsuario="modificarUsuario"/>
    </div>
  </div>


  <ModalMensaje
  :visible="modal.visible"
  :titulo="modal.titulo"
  :mensaje="modal.mensaje"
  :tipo="modal.tipo"
  @cerrar="cerrarModal"
/>



</template>

<script setup>
import MenuLateral from '../components/MenuLateral.vue'
import BuscadorProfesores from '../components/BuscadorProfesores.vue'
import TarjetaProfesor from '../components/TarjetaProfesor.vue'
import ModalMensaje from '../components/ModalMensaje.vue'

import { ref, onMounted} from 'vue'
import axios from 'axios'

const busqueda = ref('')
const resultados = ref([])
const profesorSeleccionado = ref(null)
const formularios = ref({})
const isLoading = ref(false)
const erroresFormulario = ref({});


// Modal genérico
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
}

function cerrarModal() {
  modal.value.visible = false
}

// Buscar desde componente hijo
function buscarProfesoresDesdeEvento(valor) {
  busqueda.value = valor
  buscarProfesores()
}

// Buscar profesores
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
    resultados.value = response.data
  } catch (error) {
    console.error('Error al buscar profesores:', error)
  }
}


// Obtener todos los profesores
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

// optener todos los profesores al incio de la pagina que llama a obtenerTodosLosProfesores
onMounted(() => {
  obtenerTodosLosProfesores()
})


// Obtener formulario

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


// Funcion para cerrar el formulario
function cancelarFormulario() {
  profesorSeleccionado.value = null
}



// Guardar usuario
async function guardarUsuario(profesor) {
  const datos = formularios.value[profesor.idProfesor]
  erroresFormulario.value = {} // limpiar errores previos

  if (!datos?.email || !datos?.password || !datos?.rol) {
    mostrarModal('❌ Campos incompletos', 'Por favor, completa todos los campos.', 'warning')
    return
  }

  const payload = {
    nombre: profesor.nombre,
    email: datos.email,
    contraseña: datos.password,
    rol: datos.rol
  }

  isLoading.value = true

  try {
    await axios.post(`http://localhost:8081/api/usuarios/crear-con-profesor/${profesor.idProfesor}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })

    mostrarModal('✅ Usuario creado', `Se ha vinculado correctamente a ${profesor.nombre}`, 'success')
    profesorSeleccionado.value = null
    obtenerTodosLosProfesores()
  } catch (error) {
    if (error.response && error.response.status === 400 && typeof error.response.data === 'object') {
      erroresFormulario.value = error.response.data
    } else {
      mostrarModal('❌ Error', 'No se pudo crear el usuario. Verifica los datos o si ya existe.', 'error')
    }
  } finally {
    isLoading.value = false
  }
}


// Función para borrar usuario
async function eliminarUsuario(profesor) {
  console.log("ID del usuario a eliminar:", profesor.usuario.id) // 👈 Aquí ahora imprime el correcto

  if (!confirm(`¿Estás seguro de eliminar el usuario vinculado a ${profesor.nombre}?`)) return

  try {
    await axios.delete(`http://localhost:8081/api/usuarios/${profesor.usuario.id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })

    mostrarModal('✅ Usuario eliminado', `El usuario de ${profesor.nombre} ha sido eliminado.`, 'success')
    obtenerTodosLosProfesores()
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    mostrarModal('❌ Error', 'No se pudo eliminar el usuario.', 'error')
  }
}

// Modificar usuario
async function modificarUsuario(usuarioActualizado) {
  erroresFormulario.value = {} // limpiar errores previos

  const { id, nombre, email, contraseña, rol } = usuarioActualizado

  if (!email || !rol) {
    mostrarModal('❌ Campos requeridos', 'Email y rol son obligatorios.', 'warning')
    return
  }

  isLoading.value = true
  console.log(localStorage.getItem('token'))
  try {
    await axios.put(`http://localhost:8081/api/usuarios/${id}`, {
      nombre,
      email,
      contraseña: contraseña || null, // si viene vacío, no se actualiza
      rol
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    })

    mostrarModal('✅ Usuario actualizado', `El usuario de ${nombre} ha sido modificado correctamente.`, 'success')
    profesorSeleccionado.value = null
    obtenerTodosLosProfesores()
  } catch (error) {
    if (error.response?.status === 400 && typeof error.response.data === 'object') {
      erroresFormulario.value = error.response.data
    } else {
      console.error('Error al actualizar usuario:', error)
      mostrarModal('❌ Error', 'No se pudo actualizar el usuario.', 'error')
    }
  } finally {
    isLoading.value = false
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

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  position: relative;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
  text-align: center;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 12px;
  border: none;
  background: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
