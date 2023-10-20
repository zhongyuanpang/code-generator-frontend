import {defineStore} from 'pinia'

export const templateStore = defineStore('template', {
    state: () => ({
        // 选中的标签
        selectTagValue: "",
        // 选中的组件
        selectTagRef:"",
        // 生成的结果
        result: "",
        // 结果展示状态
        resultVisible: false,
    }),
    actions: {
        SET_SELECT_TAG_VALUE(params: any) {
            this.selectTagValue = params;
        },
        GET_SELECT_TAG_VALUE() {
            return this.selectTagValue
        },
        SET_SELECT_TAG_REF(params: any) {
            this.selectTagRef = params;
        },
        GET_SELECT_TAG_REF() {
            return this.selectTagRef
        },
        SET_RESULT(params: any) {
            this.result = params;
        },
        GET_RESULT() {
            return this.result
        },
        SET_RESULT_VISIBLE(params: any) {
            this.resultVisible = params;
        },
        GET_RESULT_VISIBLE() {
            return this.resultVisible
        },
    },

    persist: process.client && {
        storage: localStorage,
    },
})