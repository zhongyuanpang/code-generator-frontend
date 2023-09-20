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
                <NuxtLink :to="{name:'ddl'}" :class="{ active : isActive == 1 }" v-on:click.native="selActive(1)">DDL</NuxtLink>
                <NuxtLink :to="{name:'ddl'}" :class="{ active : isActive == 1 }" v-on:click.native="selActive(1)">DDL</NuxtLink>
                <NuxtLink :to="{name:'ddl'}" :class="{ active : isActive == 1 }" v-on:click.native="selActive(1)">DDL</NuxtLink>
                <NuxtLink :to="{name:'ddl'}" :class="{ active : isActive == 1 }" v-on:click.native="selActive(1)">DDL</NuxtLink>
                <NuxtLink :to="{name:'ddl'}" :class="{ active : isActive == 1 }" v-on:click.native="selActive(1)">DDL</NuxtLink>
            </div>
        </div>

        <!-- 右侧链接 -->
        <div class="connect">
            <!-- 操作按钮 -->
            <div class="connect-btn">
                <el-button type="primary" @click="openConnect" v-if="!connecter.connectInfo.dataName">连接</el-button>
                <el-avatar v-else class="avatar_bg">{{connecter.connectInfo.dataName}}</el-avatar>
            </div>
        </div>

        <!-- 连接弹窗 -->
        <client-only>
            <el-dialog
                v-model="connectVisible"
                title="配置连接"
                width="30%"
                draggable
            >
                <el-form :model="connectForm" size="small">
                    <el-form-item label="IP地址" :label-width="formLabelWidth">
                        <el-input v-model="connectForm.url" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="端口号" :label-width="formLabelWidth">
                        <el-input v-model="connectForm.port" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="数据库类型" :label-width="formLabelWidth">
                        <el-radio-group v-model="connectForm.dataType">
                          <el-radio v-for="(item,index) in typeList" :key="index" :label="item">{{item}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="数据库名称" :label-width="formLabelWidth">
                        <el-input v-model="connectForm.dataName" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="用户名" :label-width="formLabelWidth">
                        <el-input v-model="connectForm.username" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="密码" :label-width="formLabelWidth">
                        <el-input v-model="connectForm.password" autocomplete="off" show-password type="password"/>
                    </el-form-item>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="connectVisible = false">取消</el-button>
                        <el-button type="primary" @click="connect">
                          连接
                        </el-button>
                    </span>
                </template>
            </el-dialog>
        </client-only>
    </header>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {ElMessage} from 'element-plus'
import {Http} from "@/utils/request";
import {connectStore} from "~/store/connecter"
const connecter = connectStore();

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
    connectForm = connecter.getConnectInfo()
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
            connecter.setConnectInfo(connectForm);
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
