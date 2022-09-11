import { str } from './moduleA.js'
import { createApp, h } from 'vue'
import 'src/test.js'
import { test } from 'src/utils/index.js'
import App from './components/App.vue'
// console.log('App', App)
console.log(str)
test()
// const App = {
//   render() {
//     return h('div', null, [h('div', null, String('1213'))])
//   }
// }

createApp(App).mount('#App')