import {defineStore} from 'pinia'

export const tableColumnSelectStore = defineStore('tableColumnSelect', {
    state: () => ({
        // 表原始数据
        gridOptionsData:[],
        // 选中的表数据
        gridOptionsSelectData:[],
        // 选中的表名
        selectTableName:"",
    }),
    actions: {
        SET_GRID_OPTIONS_DATA(params: any) {
            this.gridOptionsData = params;
        },
        GET_GRID_OPTIONS_DATA() {
            return this.gridOptionsData
        },
        SET_GRID_OPTIONS_SELECT_DATA(params: any) {
            this.gridOptionsSelectData = params;
        },
        GET_GRID_OPTIONS_SELECT_DATA() {
            return this.gridOptionsSelectData
        },
        SET_SELECT_TABLE_NAME(params: any){
            this.selectTableName = params;
        },
        GET_SELECT_TABLE_NAME(){
            return this.selectTableName
        },
    },

    persist: process.client && {
        storage: localStorage,
    },
})