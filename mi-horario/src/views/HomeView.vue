<template>


  <MenuLateral />


  <ModalCambioContraseña
    :visible="mostrarModal"
    @cerrar="mostrarModal = false"
  />

  <!-- Contenido del home -->
  <div class="container mt-5 pt-5">
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
