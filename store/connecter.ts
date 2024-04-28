import {defineStore} from 'pinia'

export const connectStore = defineStore('connection', {
    state: () => ({
        connectInfo: {
            key: "",
            url: "",
            port: "",
            dataBase: "",
            username: "",
            password: "",
            dataType: "",
            table:"",
        },
        selectHistoryRecordIndex:null,
        historyConnectInfo:[],
    }),
    actions: {
        setConnectInfo(params: any) {
            this.connectInfo = params;
        },
        getConnectInfo() {
            return this.connectInfo
        },
        setSelectHistoryRecordIndex(index: number) {
            this.selectHistoryRecordIndex = index;
        },
        getSelectHistoryRecordIndex() {
            return this.selectHistoryRecordIndex
        },
        setHistoryConnectInfo(params: any) {
            const historyConnectInfo = this.getHistoryConnectInfo()

            console.log(historyConnectInfo,params._rawValue)
            if (historyConnectInfo && historyConnectInfo.length) {
                // 使用 Array.prototype.some() 检查是否存在相同的对象
                const exists = historyConnectInfo.some(item => this.sObjectEqual(item, params._rawValue));

                // 如果不存在相同的对象，则将 params._rawValue 添加到 historyConnectInfo 数组中
                if (!exists) {
                    this.historyConnectInfo.push(params._rawValue);
                }

            } else {
                this.historyConnectInfo.push(params._rawValue)
            }
        },
        getHistoryConnectInfo() {
            return this.historyConnectInfo
        },
        removeHistoryConnectInfoByIndex(index: number) {
            this.historyConnectInfo.splice(index, 1);
        },
        removeHistoryConnectInfo(){
            this.historyConnectInfo = []
        },
        sObjectEqual(obj1, obj2) {
            // 检查类型是否为对象
            if (typeof obj1 !== 'object' || typeof obj2 !== 'object') {
                return false;
            }

            // 检查对象的键数量是否相同
            const keys1 = Object.keys(obj1);
            const keys2 = Object.keys(obj2);
            if (keys1.length !== keys2.length) {
                return false;
            }

            // 检查对象的每个键值对是否相同
            for (let key of keys1) {
                const val1 = obj1[key];
                const val2 = obj2[key];

                // 递归比较对象的值
                if (typeof val1 === 'object' && typeof val2 === 'object') {
                    if (!isObjectEqual(val1, val2)) {
                        return false;
                    }
                } else if (val1 !== val2) {
                    return false;
                }
            }

            // 如果上述条件都满足，则对象相等
            return true;
        }

    },

    persist: process.client && {
        storage: localStorage,
    },
})