import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import {productsRepo} from "./api";

createApp(App).mount('#app')

productsRepo.findFirst().then(r => r.appendName())
