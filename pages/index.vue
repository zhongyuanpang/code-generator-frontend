<script lang="ts" setup>

</script>

<template>
    <div class="page">
        <!-- 封面 -->
        <div class="banner-brand__wrapper">
            <div class="banner-brand__content">
                <h1 class="title">TemplateCode 模板代码</h1>
                <p class="description">简洁、友好、易用的代码模板生成工具。</p>
                <p class="tagline">一款模板代码生成工具,不同于常规代码生成器。自定义代码模板,自定义连接数据库,快速选择字段生成代码减少重复工作。</p>
                <div class="btn-group">
                    <a href="https://github.com/zhongyuanpang/code-generator-frontend" target="_blank">
                        <span class="btn-source">开源地址</span>
                    </a>
                </div>
            </div>
        </div>

        <!-- 案例展示 -->
        <div class="video">

        </div>
    </div>
</template>

<style lang="scss" scoped>
.page{
    .banner-brand__wrapper{
        //height: calc(100vh - 56px);
        height: calc(100vh);
        //background-image: url("https://pic1.58cdn.com.cn/nowater/webim/big/n_v25e4330ca575a4ba0acbbc276e4ead72e.png");
        background: url("/assets/images/bg.svg") no-repeat center center;
        background-size: cover;
        display: flex;
        align-items: center;
        justify-content: center;

            .banner-brand__content {
                margin-top: -8rem;
                box-sizing: border-box;
                display: block;
                max-width: 768px;
                padding-left: 1.5rem;
                padding-right: 1.5rem;

                .title {
                    background: linear-gradient(to right, #4C87F3 , #ef4444); /* 渐变颜色 */
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    font-size: 3.7rem!important;
                    line-height: 1!important;
                }

                .description {
                    font-size: 2.25rem;
                    line-height: 2rem;
                }

                .tagline {
                    color: #3c3c43bf;
                }

                .btn-group {
                    margin-top: 2rem;
                    list-style-type: none;
                    padding-left: 0;
                    text-align: left;

                    .btn-source {
                        margin-bottom: 1rem;
                        padding: 10px 1rem;
                        cursor: pointer;
                        border-radius: .5rem;
                        background-color: #4c87f3e6;
                        vertical-align: middle;
                        font-weight: 600;
                        --tw-text-opacity: 1;
                        color: rgb(255 255 255 / var(--tw-text-opacity));
                    }
                }
            }
    }

    .video{
        height: 500px;
        //border: 1px solid;
    }
}
</style>
