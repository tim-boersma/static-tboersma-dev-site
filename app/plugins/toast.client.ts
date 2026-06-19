import { defineNuxtPlugin } from '#app'
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(ToastService);
    nuxtApp.vueApp.component('Toast', Toast);
})