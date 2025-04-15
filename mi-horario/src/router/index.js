import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import PerfilView from '../views/PerfilView.vue'
import DatosProfesoradoView from '../views/DatosProfesoradoView.vue'
import DatosProfesor from '../views/DatosProfesor.vue'
import FormularioUsuarioView from '../views/FormularioUsuarioView.vue'
import AusenciasProfesorView from '../views/AusenciasProfesorView.vue'




const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/home', component: HomeView },
  { path: '/perfil', component: PerfilView },
  { path: '/datos-profesorado', component: DatosProfesoradoView },
  { path: '/profesor/:id', component: DatosProfesor },
  { path: '/formulario/:id', component: FormularioUsuarioView },
  { path: '/mis-ausencias', component: AusenciasProfesorView },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
