<template>
  <div class="slide-box" v-show="slideFlag">
      <div class="back-up" @click="backTop()">
        <BacktopIcon style="color: white" size="large"/>
      </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      slideFlag: false,
    };
  },
  mounted() {
    // 监听屏幕滚动
    window.addEventListener("scroll", this.scrollToTop);
  },
  destroyed() {
    window.removeEventListener("scroll", this.scrollToTop);
  },
  methods: {
    //   监听屏幕滚动
    scrollToTop() {
      const that = this;
      let scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      that.scrollTop = scrollTop;
      if (that.scrollTop > 60) {
        that.slideFlag = true;
      } else {
        that.slideFlag = false;
      }
    },

    // 回到顶部
    backTop() {
      const that = this;
      let timer = setInterval(() => {
        let ispeed = Math.floor(-that.scrollTop / 9);
        document.documentElement.scrollTop = document.body.scrollTop =
          that.scrollTop + ispeed;
        if (that.scrollTop === 0) {
          clearInterval(timer);
        }
      }, 16);
    },
  },
};
</script>

<style lang="scss" scoped>
.slide-box {
  position: fixed;
  right: 15px;
  bottom: 50px;
  z-index: 999 !important;
  transition: .8s;

  .back-up {
    cursor: pointer;
    height: 40px;
    width: 40px;
    margin-top: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    background:$default-background;
    border-radius: 7px;
    border: none;
  }
}
</style>