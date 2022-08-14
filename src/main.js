import { str } from './moduleA.js'
import { createApp, h } from 'vue'
import App from './components/App.vue'
// console.log('App', App)
console.log(str)

// const App = {
//   render() {
//     return h('div', null, [h('div', null, String('1213'))])
//   }
// }

createApp(App).mount('#App')