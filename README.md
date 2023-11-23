# 简介

一款根据用户配置数据库连接、以表格形式展示表的信息，选择表字段信息根据自定义模板快速生成代码的工具。

特点：对于一些重复性开发工作（例如：erp）提升工作效率、也可作为参照模板写法文档



# 技术栈

**开发工具**：WebStorm

**Node版本：** 18.16.0

**包管理工具：** Yarn

**语言：** Nuxt3 、 TypeScript、Pinia、Sass

**UI框架：** TDesign

**表格组件：** vxe-table



# 前端项目依赖



## TDesign ( 腾讯UI框架 )

```bash
yarn add tdesign-vue-next
```

配置

在`plugins`下新增`tdesign.client.ts`文件

```typescript
import {defineNuxtPlugin} from '#app';

import TDesign from 'tdesign-vue-next';
// 引入组件库的少量全局样式变量
import 'tdesign-vue-next/es/style/index.css';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(TDesign)
})
```



## mavoneditor 编辑器

```bash
yarn add mavon-editor@3.0.0-beta
```

配置：

在`plugins`下新增 `mavon-editor.client.ts`文件

```typescript
import * as mavoneditor from 'mavon-editor';
import "mavon-editor/dist/css/index.css";

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(mavoneditor);
})
```

在`nuxt.config.ts`添加

```typescript
css:[
    'mavon-editor/dist/css/index.css',
],
```



## prismjs 代码高亮

```bsh
yarn add @types/prismjs prismjs vite-plugin-prismjs
```

配置：

在`nuxt.config.ts`中 引入css配置prismjsPlugin

```typescript
import {prismjsPlugin} from 'vite-plugin-prismjs'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  // devtools: { enabled: true },
  app:{
    head:{
      title:"困了睡大觉",
      bodyAttrs: { style: 'height: 100%; margin:0; padding: 0;' },
      meta:[
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' },
      ]
    }
  },
  css:[
      "~/assets/lib/prism/themes/BlackMac.css",
      "~/assets/lib/prism/prism.css",
      "~/assets/styles/typo.css",
  ],
  modules: [
    '@pinia/nuxt',
  ],
  //配置全局scss样式
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/default.scss" as *;'	// 注意文件路径要配成自己的
        }
      }
    },
    plugins: [
      prismjsPlugin({
        // ['json', 'css'] 按需引入，'all' 所有语言
        languages: 'all',
        // 配置行号插件
        plugins: ['toolbar', 'show-language', 'copy-to-clipboard','line-numbers'],
        // 主题名
        // theme: 'dark',
        css: true
      })
    ],
  },
})

```

使用:

```js
<script setup lang="ts">
import {ref,onMounted,nextTick} from 'vue'
import Prism from 'prismjs'

onMounted(()=>{
  nextTick(()=>{
    Prism.highlightAll()
  })
})
</script>
```



## vxe-table 表格组件

```bash
yarn add vxe-table xe-utils
```

配置：

在`plugins`下新增`vxe-table.client.ts`

```typescript
import { defineNuxtPlugin } from '#app';
import VxeTable from 'vxe-table';
import 'vxe-table/lib/style.css';

import XEUtils from 'xe-utils';
import FilterContent from '~/composables/FilterContent.vue';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('filterContent', FilterContent)
    VxeTable.renderer.add('FilterContent', {
        showFilterFooter: false,
        // renderFilter(renderOpts, params) {
        //     return [
        //         h(FilterContent, { params, attr: renderOpts.attrs })
        //     ];
        // },
        // filterResetMethod({ options }) {
        //     options.forEach((option) => {
        //         option.data = { valueArray: [], selectValue: '' };
        //     });
        // },
        // filterMethod({ option, row, column }) {
        //     const { valueArray } = option.data;
        //     let cellValue = XEUtils.get(row, column.field);
        //     return valueArray.includes(cellValue);
        // },
    });

    nuxtApp.vueApp.use(VxeTable)
});
```



## pinia 状态管理

```bash
yarn add @pinia/nuxt pinia pinia-plugin-persistedstate
```



配置：

在`plugins`下新建`pinia.ts`

```typescript
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.$pinia.use(piniaPluginPersistedstate)
})

```



使用：

在`store`下新建`header.ts`

```typescript
import {defineStore} from 'pinia'

export const headerStore = defineStore('active',{
    state: () => {
        return { active: 0 }
    },
    actions: {
        setActive(params: any) {
            this.active = params;
        },
        getActive() {
            return this.active
        },
    },

    persist: process.client && {
        storage: sessionStorage,
    }
})
```

页面使用

```vue
<script setup lang="ts">
import {headerStore} from "~/store/header"
    
const headerState = headerStore();
    
headerState.setActive(0)
headerState.getActive();
</script>
```

