<template>
    <div class="z-layout">
        <div class="z-topBar">
            <Header/>
        </div>
        <div class="z-main">
            <transition name="fade-transform" mode="out-in">
                <slot class="nuxt" />
            </transition>
        </div>
        <div class="z-bottom">
            <Footer/>
        </div>
    </div>
</template>


<script lang="ts" setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
</script>

<style lang="scss" scoped>
$nav-height: 55px;
$full-height: calc(100vh - $nav-height);

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
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

/* Chrome/Safari */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #666;
  border-radius: 5px;
}
/* Firefox */
* {
  scrollbar-width: thin;
}
*::-webkit-scrollbar {
  display: none;
}
*::-moz-scrollbar {
  width: 8px;
}
*::-moz-scrollbar-thumb {
  background-color: #666;
  border-radius: 5px;
}

/* fade-transform */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all .5s;
}

.fade-transform-enter {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.z-layout {
  margin: 0;
  padding: 0;
  height: $full-height;
  background: #FFF;
}

.z-topBar {
  border-bottom: 1px solid #e5e5e5;
}

.z-main {
  margin-top: $nav-height;
  min-height: calc(100% - 57px); /* 计算内容区域的最小高度 */
  //background-color: #f2f2f2;
  padding: 0 100px;
  .nuxt {
    position: relative;
    width: 100%;
    height:100%;
    min-height: 100vh;
    background: #FFF;
    margin: 0;
    padding: 0;
  }
}

.z-bottom{
}

</style>
