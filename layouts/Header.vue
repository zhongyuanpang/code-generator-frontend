<script setup>
import {reactive, ref,onMounted } from 'vue'
import {MessagePlugin} from 'tdesign-vue-next';
import {Http} from "@/utils/request";
import {connectStore} from "~/store/connecter"
import {headerStore} from "~/store/header"
const connection = connectStore();
const headerState = headerStore();

// 选中状态
const isActive = ref(0);
// 连接弹窗
const connectVisible = ref(false);

// 历史连接
const historyConnect = ref([]);
const historyRecordIndex = ref(null);

// 统一label宽度
const formLabelWidth = '100px'

// 连接表单
const connectForm = ref({
  key:"",
  url:"",
  port:"",
  dataBase:"",
  username:"",
  password:"",
  dataType:"",
})

// 数据库类型列表
const typeList = reactive([
  "MySQL","SQL Server","Postgre SQL"
])

/**
 * 切换标签样式
 * @type {selActive}
 */
const selActive = ((index) => {
  isActive.value = index
  headerState.setActive(index)
})

/**
 * 打开连接面板
 * @type {openConnect}
 */
const openConnect = (() => {
  connectVisible.value = true
  connectForm.value = connection.getConnectInfo()
  historyConnect.value = connection.getHistoryConnectInfo()
  historyRecordIndex.value = connection.getSelectHistoryRecordIndex()
})

/**
 * 连接测试
 * @type {connect}
 */
const connect = (() => {
  Http({
    url: '/datasource/connectionTest',
    method:'post',
    body:connectForm
  }).then((res)=>{
    const {code,data} = res
    if (code === 200){
      connectVisible.value = false;
      MessagePlugin.success('连接成功');
      connection.setConnectInfo(connectForm);
    } else {
      MessagePlugin.error('连接失败！请核对信息');
    }
  })
})

/**
 * 存储记录
 * @type {storageRecord}
 */
const storageRecord = (() => {
  connection.setHistoryConnectInfo(connectForm);
  const index = connection.getHistoryConnectInfo().length
  historyRecordIndex.value = index
  connection.setSelectHistoryRecordIndex(index)
})

/**
 * 清空历史连接记录
 * @type {removeRecords}
 */
const removeRecords = (() => {
  connection.removeHistoryConnectInfo();
})

/**
 * 删除指定记录
 * @type {removeHistoryConnect}
 */
const removeHistoryConnect = ((index) => {
  if (index === historyRecordIndex.value) {
    connection.setSelectHistoryRecordIndex(null);
  }

  connection.removeHistoryConnectInfoByIndex(index);
})

/**
 * 替换历史记录
 * @type {selectHistoryRecord}
 */
const selectHistoryRecord = ((record,index) => {
  connection.setConnectInfo(record);
  connection.setSelectHistoryRecordIndex(index);
  connectForm.value = record
  historyRecordIndex.value = index
})

onMounted(() => {
  isActive.value = headerState.getActive();
})
</script>

<template>
    <!-- 粘性导航 -->
    <header class="navbar">
        <!-- 左侧菜单 -->
        <div class="menu_bar">
            <!-- logo -->
            <a href="/" class="logo">
                <img src="~/assets/images/logo.png" alt="">
                TEMPLATE CODE
            </a>
            <!-- 跳转菜单 -->
            <div class="menu">
                <NuxtLink to="/" :class="{ active : isActive === 0 }" v-on:click.native="selActive(0)">首页</NuxtLink>
                <NuxtLink :to="{name:'template'}" :class="{ active : isActive === 1 }" v-on:click.native="selActive(1)">模板</NuxtLink>
                <NuxtLink :to="{name:'ddl'}" :class="{ active : isActive === 2 }" v-on:click.native="selActive(2)">DDL</NuxtLink>
                <NuxtLink :to="{name:'tool'}" :class="{ active : isActive === 3 }" v-on:click.native="selActive(3)">AI工具</NuxtLink>
                <NuxtLink :to="{name:'ai'}" :class="{ active : isActive === 4 }" v-on:click.native="selActive(4)">GPT</NuxtLink>
            </div>
        </div>

        <!-- 右侧链接 -->
        <div class="connect">
            <!-- 操作按钮 -->
            <div class="connect-btn">
                <t-button @click="openConnect" v-if="!connection.connectInfo.dataBase">连接</t-button>
                <t-avatar v-else size="medium" style="cursor: pointer" @click="openConnect">{{connection.connectInfo.dataBase}}</t-avatar>
            </div>

<!--            <div class="theme-switcher">-->
<!--                <input type="radio" name="themes" id="light-theme"/>-->
<!--                <label for="light-theme">-->
<!--                  <ModeLightIcon />-->
<!--                  <span>Light</span>-->
<!--                </label>-->
<!--                <input type="radio" name="themes" id="dark-theme"/>-->
<!--                <label for="dark-theme">-->
<!--                  <ModeDarkIcon />-->
<!--                  <span>Dark</span>-->
<!--                </label>-->
<!--            </div>-->
        </div>
    </header>

    <!-- 连接弹窗 -->
    <div>
    <client-only>
        <t-dialog
            draggable
            destroyOnClose
            header="配置连接"
            width="60%"
            v-model:visible="connectVisible">

          <t-row>
            <t-col :span="7">
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
                <t-form-item label="数据库名称" name="dataBase" :label-width="formLabelWidth">
                  <t-input v-model="connectForm.dataBase" ></t-input>
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
            </t-col>
            <t-col :span="5">
              <div><strong>历史连接</strong></div>
              <div style="max-height: 300px;overflow-y: scroll;">
                <t-card v-for="(item,index) in historyConnect" :title="item.dataBase" :key="index"
                        hover-shadow class="history-card" :style="{ width: '350px',marginBottom:'10px' }"
                        :class="{'history-card-active' : historyRecordIndex === index }" @click="selectHistoryRecord(JSON.parse(JSON.stringify(item)),index)">
                  <div>IP：{{item.url}} 端口：{{item.port}}</div>
                  <template #actions>
                    <t-button theme="primary" shape="circle" @click="removeHistoryConnect(index)">
                      <template #icon><Delete1Icon /></template>
                    </t-button>
                  </template>
                </t-card>
              </div>
            </t-col>
          </t-row>

          <template #footer>
            <t-row>
              <t-col :span="7">
                <t-button class="klsdj-btn" theme="primary" @click="storageRecord">
                  <template #icon><SaveIcon /></template>
                  存储
                </t-button>
                <t-button @click="connect" theme="success">
                  <template #icon><MapConnectionIcon /></template>
                  连接
                </t-button>
              </t-col>
              <t-col :span="5">
                <t-button theme="primary" @click="removeRecords">
                  <template #icon><Delete1Icon /></template>
                  清空历史
                </t-button>
              </t-col>
            </t-row>
          </template>

        </t-dialog>
    </client-only>
    </div>
</template>

<style lang="scss" scoped>
@import "~/assets/styles/header.scss";

.history-card-active {
  background-color: $base-color;
  color: white;
  :deep(.t-card__title) {
    color: white;
  }
}

.history-card {
  cursor: pointer;
}
  //
  //.theme-switcher input {
  //  display: none;
  //}
  //
  //.theme-switcher {
  //  position: relative;
  //  background-color: var(--c-bg-secondary);
  //  border-radius: 10px;
  //  display: flex;
  //  padding: 0 3px;
  //
  //  & label {
  //    position: relative;
  //    display: flex;
  //    z-index: 2;
  //    padding: 8px 0;
  //    width: calc(100% / 2);
  //    color: var(--c-text-secondary);
  //    & span {
  //      display: flex;
  //      justify-content: center;
  //      font-weight: 600;
  //      opacity: 0.8;
  //      &:hover{
  //        opacity: 1;
  //        cursor: pointer;
  //      }
  //    }
  //  }
  //}
</style>
