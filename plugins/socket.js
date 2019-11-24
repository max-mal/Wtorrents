
window.ratsSocket = io('http://localhost:8095/');
window.serverSocket = io('http://localhost:3021/')

window.onNuxtReady(() => {
  console.log('Nuxt.js is ready and mounted')
})