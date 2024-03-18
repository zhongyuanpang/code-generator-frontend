<template>
    <div class="layout">
        <div class="navbar">
            <Header/>
        </div>
        <div class="page">
            <transition name="fade-transform" mode="out-in">
                <slot class="nuxt"/>
            </transition>
        </div>
<!--        <div class="footer">-->
<!--            <Footer/>-->
<!--        </div>-->
        <SlideMenu/>
    </div>
</template>


<script lang="ts" setup>
import Header from "./Header.vue";
import Footer from "./Footer.vue";
import SlideMenu from "./SlideMenu.vue";
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

.layout {
  margin: 0;
  padding: 0;
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: $nav-height;
}

.page {
  height: 100vh;
}

.footer{
}

</style>
