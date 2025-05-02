<template>
    <MenuLateral />

    <div class="container-xl mt-5 pt-4 px-3">
        <!-- Contenedor principal con margen horizontal -->

        <!-- Perfil -->
        <div class="mt-4 d-flex flex-column align-items-center">
            <input type="file" accept="image/*" ref="inputArchivo" @change="subirImagen" style="display: none;" />

            <img :src="imagenPerfil || imagenPorDefecto" alt="Foto de perfil" class="rounded-circle"
                style="width: 150px; height: 150px; object-fit: cover; cursor: pointer;" @click="confirmarYSubir" />

            <p class="mt-3">{{ profesor?.nombre }}</p>
            <p v-if="profesor?.usuario"><strong>Email:</strong> {{ profesor.usuario.email }}</p>
        </div>

        <!-- Horario -->
        <div class="mt-5">
            <Horario :idProfesor="profesor?.idProfesor" />

            <AusenciasProfesor v-if="profesor?.usuario?.id" :idUsuario="profesor.usuario.id" />
        </div>
    </div>

    <!-- Modal -->
    <ModalMensaje :visible="modal.visible" :titulo="modal.titulo" :mensaje="modal.mensaje" :tipo="modal.tipo"
        @cerrar="modal.visible = false" />
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import MenuLateral from '../components/MenuLateral.vue'
import Horario from '../components/Horario.vue'
import ModalMensaje from '../components/ModalMensaje.vue'
import AusenciasProfesor from '../components/AusenciasProfesor.vue'

const route = useRoute()
const idProfesor = route.params.id

const profesor = ref(null)
const imagenPerfil = ref(null)
const inputArchivo = ref(null)

const imagenPorDefecto = 'https://img.freepik.com/vector-premium/icono-usuario-avatar-perfil-usuario-icono-persona-imagen-perfil-silueta-neutral-genero-adecuado_697711-1132.jpg'

// Modal personalizado
const modal = ref({
    visible: false,
    titulo: '',
    mensaje: '',
    tipo: 'info'
})

function mostrarModal(titulo, mensaje, tipo = 'info') {
    modal.value = { visible: true, titulo, mensaje, tipo }
}

async function obtenerDatosProfesor() {
    try {
        const response = await axios.get(`http://localhost:8081/api/profesores/${idProfesor}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        })
        profesor.value = response.data
        cargarImagen()
    } catch (error) {
        mostrarModal('Error', 'No se pudo cargar el profesor.', 'error')
    }
}

async function cargarImagen() {
    try {
        const idUsuario = profesor.value?.usuario?.id
        if (!idUsuario || !profesor.value.usuario.imagen) return

        const response = await axios.get(
            `http://localhost:8081/api/usuarios/${idUsuario}/imagen`,
            {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'arraybuffer',
                validateStatus: status => status === 200
            }
        )

        const tipo = response.headers['content-type']
        const base64 = btoa(
            new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), '')
        )
        imagenPerfil.value = `data:${tipo};base64,${base64}`
    } catch {
        imagenPerfil.value = null
    }
}

function confirmarYSubir() {
    if (confirm('¿Estás seguro de que quieres subir una nueva imagen de perfil?')) {
        inputArchivo.value?.click()
    }
}

async function subirImagen(event) {
    const archivo = event.target.files[0]
    const idUsuario = profesor.value?.usuario?.id
    if (!archivo || !idUsuario) return

    const formData = new FormData()
    formData.append('imagen', archivo)

    try {
        await axios.post(`http://localhost:8081/api/usuarios/${idUsuario}/imagen`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        mostrarModal('✅ Imagen actualizada', 'La imagen de perfil se actualizó correctamente.', 'success')
        cargarImagen()
    } catch {
        mostrarModal('❌ Error', 'No se pudo subir la imagen.', 'error')
    }
}

onMounted(() => {
    obtenerDatosProfesor()
})
</script>

<style scoped>
.contenedor-datos {
    max-width: 600px;
    margin: auto;
}
</style>