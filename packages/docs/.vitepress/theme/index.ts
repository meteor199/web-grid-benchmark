import { h, defineAsyncComponent } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './custom.css';

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component(
      'BulkDataPush',
      defineAsyncComponent(() => import('../../components/BulkDataPush.vue'))
    );

    app.component(
      'RenderData',
      defineAsyncComponent(() => import('../../components/RenderData.vue'))
    );

    app.component(
      'ScrollData',
      defineAsyncComponent(() => import('../../components/ScrollData.vue'))
    );
    
    app.component(
      'SortData',
      defineAsyncComponent(() => import('../../components/SortData.vue'))
    );
  },
};
