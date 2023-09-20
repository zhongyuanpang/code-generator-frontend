import {defineStore} from 'pinia'

export const connectStore = defineStore('connection', {
    state: () => ({
        connectInfo: {
            key: "",
            url: "",
            port: "",
            dataName: "",
            username: "",
            password: "",
            dataType: "",
        }
    }),
    actions: {
        setConnectInfo(params: any) {
            this.connectInfo = params;
        },
        getConnectInfo() {
            return this.connectInfo
        },
    },

    persist: process.client && {
        storage: localStorage,
    },
})