<template>
  <MenuLateral />
  <ModalCambioContraseña :visible="mostrarModal" @cerrar="mostrarModal = false" />
  <div class="mx-4" style="margin-top: 150px;">
  <Horario />
</div>

</template>




<script setup>
import { ref, onMounted } from 'vue'
import MenuLateral from '../components/MenuLateral.vue'
import Horario from '../components/Horario.vue'
import ModalCambioContraseña from '../components/ModalCambioContraseña.vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const mostrarModal = ref(false)

onMounted(() => {
  if (auth.usuario?.cambiarContraseña) {
    mostrarModal.value = true
  }
})

</script>
