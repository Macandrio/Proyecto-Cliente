<template>
  <Menu v-if="showMenu && auth.logueado" />
  <router-view />
</template>

<script setup>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'

import Menu from './components/Menu.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const route = useRoute()
const auth = useAuthStore()


// Solo muestra el menú si la ruta actual NO es '/login'
const showMenu = computed(() => route.path !== '/login')
</script>