<template>
    <!-- 粘性导航 -->
    <header>
        <!-- 左侧菜单 -->
        <div class="menu_bar">
            <!-- logo -->
            <a href="/" class="logo">
                <img src="https://pic3.58cdn.com.cn/nowater/webim/big/n_v2b60501fb846d4a1abcb3e85c4716770d.png" alt="">
                Code
            </a>
            <!-- 跳转菜单 -->
            <div class="menu">
                <NuxtLink to="/" :class="{ active : isActive == 0 }" v-on:click.native="selActive(0)">首页</NuxtLink>
                <NuxtLink :to="{name:'ddl'}" :class="{ active : isActive == 1 }" v-on:click.native="selActive(1)">模板</NuxtLink>
            </div>
        </div>

        <!-- 右侧链接 -->
        <div class="connect">
            <!-- 操作按钮 -->
            <div class="connect-btn">
                <t-button @click="openConnect" v-if="!connection.connectInfo.dataName">连接</t-button>
                <t-avatar v-else size="medium" style="cursor: pointer" @click="openConnect">{{connection.connectInfo.dataName}}</t-avatar>
            </div>
        </div>

        <!-- 连接弹窗 -->
        <client-only>
          <t-dialog
              draggable
              destroyOnClose
              header="配置连接"
              width="30%"
              v-model:visible="connectVisible">
            <t-form ref="form" :data="connectForm" :colon="true" size="small">
              <t-form-item label="IP地址" name="url" :label-width="formLabelWidth">
                <t-input v-model="connectForm.url" ></t-input>
              </t-form-item>
              <t-form-item label="端口号" name="port" :label-width="formLabelWidth">
                <t-input v-model="connectForm.port" ></t-input>
              </t-form-item>
              <t-form-item label="数据库类型" name="dataType" :label-width="formLabelWidth">
                <t-radio-group v-model="connectForm.dataType">
                  <t-radio v-for="(item,index) in typeList" :key="index" :value="item">{{item}}</t-radio>
                </t-radio-group>
              </t-form-item>
              <t-form-item label="数据库名称" name="dataName" :label-width="formLabelWidth">
                <t-input v-model="connectForm.dataName" ></t-input>
              </t-form-item>
              <t-form-item label="用户名" name="username" :label-width="formLabelWidth">
                <t-input v-model="connectForm.username" >
                  <template #prefix-icon>
                    <UserIcon />
                  </template>
                </t-input>
              </t-form-item>
              <t-form-item label="密码" name="password" :label-width="formLabelWidth">
                <t-input type="password" v-model="connectForm.password">
                  <template #prefix-icon>
                    <lock-on-icon />
                  </template>
                </t-input>
              </t-form-item>
            </t-form>

            <template #footer>
              <t-button theme="danger" @click="connectVisible = false">取消</t-button>
              <t-button @click="connect">连接</t-button>
            </template>

          </t-dialog>
        </client-only>
    </header>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {Http} from "@/utils/request";
import {connectStore} from "~/store/connecter"
const connection = connectStore();

  // 选中状态
  const isActive = ref(0);
  // 连接弹窗
  const connectVisible = ref(false);

  // 统一label宽度
  const formLabelWidth = '80px'

  // 连接表单
  let connectForm = reactive({
    key:"",
    url:"",
    port:"",
    dataName:"",
    username:"",
    password:"",
    dataType:"",
  })

  // 数据库类型列表
  const typeList = reactive([
      "MySQL","SQL Server","Postgre SQL"
  ])

  // 切换标签样式
  function selActive(index: any){
    isActive.value = index
  }

  // 打开连接面板
  const openConnect = () => {
    connectVisible.value = true
    connectForm = connection.getConnectInfo()
  }

  // 数据库连接
  const connect = () => {
      connectVisible.value = false;
      Http({
        url: '/datasource/connect',
        method:'post',
        body:connectForm
      }).then((res: any)=>{
        const {code,data} = res
        if (code === 200){
            ElMessage({
              message: '连接成功.',
              type: 'success',
            })
            connection.setConnectInfo(connectForm);
            return
        }
        ElMessage({
          message: '连接失败！请核对信息',
          type: 'error',
        })
      })
  }
</script>

<style lang="scss" scoped>
@import "~/assets/styles/header.scss";
</style>