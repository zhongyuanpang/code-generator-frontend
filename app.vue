<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
html,body {
  font-family: PingFang SC;
  font-size: 16px;
  word-spacing: 1px;
  height: 100%;
  margin: 0;
  padding: 0;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
  background: linear-gradient(45deg, #eff3fe 0%, #fbf4f7 50%, #edf2ff 100%);
}

:root {
  --theme-color: #19b1f5;
  --text-color: #4c4948;
  --card-box-shadow: 0 3px 8px 6px rgba(7, 17, 27, 0.05);
}

/* 隐藏滚动条 */
::-webkit-scrollbar {
  width: 0; /* 设置滚动条宽度 */
}

::-webkit-scrollbar-track {
  background: transparent; /* 设置滚动条背景颜色 */
}

::-webkit-scrollbar-thumb {
  background-color: transparent; /* 设置滚动条滑块颜色 */
}


body{
}
</style>