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
      'element-plus/dist/index.css',
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
