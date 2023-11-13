<template>
    <div class="z-layout">
        <div class="z-topBar">
            <Header/>
        </div>
        <div class="z-main">
            <transition name="fade-transform" mode="out-in">
                <slot class="nuxt"/>
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

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
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
}

.z-topBar {
  border-bottom: 1px solid #e5e5e5;
}

.z-main {
  margin-top: $nav-height;
  min-height: calc(100% - 57px); /* 计算内容区域的最小高度 */
}

.z-bottom{
}

</style>
