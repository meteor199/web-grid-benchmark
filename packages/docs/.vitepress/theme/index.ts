import { h, defineAsyncComponent } from 'vue'
import DefaultTheme from 'vitepress/theme'
import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('BulkDataPush', defineAsyncComponent(() => import('../../components/BulkDataPush.vue')))
  }
}
