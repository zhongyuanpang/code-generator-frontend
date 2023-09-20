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
      'element-plus/dist/index.css',
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

    ],
  },
})
