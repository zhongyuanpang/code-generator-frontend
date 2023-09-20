# 简介

一款根据用户配置数据库连接、以表格形式展示表的信息，选择表字段信息根据自定义模板快速生成代码的工具。

特点：对于一些重复性开发工作（例如：erp）提升工作效率、也可作为参照模板写法文档



# 技术栈

**开发工具：**WebStorm

**Node版本：**18.16.0

**包管理工具：**Yarn

**语言：**Nuxt3 、 TypeScript、Pinia、Sass

**UI框架：**Element Plus 、TDesign

**表格组件：**vxe-table



# 项目依赖

- ##### mavoneditor编辑器

  ```bash
  yarn add mavon-editor@3.0.0-beta
  ```

  - 配置：

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

- TDesign ( 腾讯UI框架 )

  ```bash
  yarn add tdesign-vue-next
  ```

  - 配置

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

    

  

