import {defineStore} from 'pinia'
import {ref} from 'vue'

export const headerStore = defineStore('active',{
    state: () => {
        return { active: 0 }
    },
    actions: {
        setActive(params: any) {
            this.active = params;
        },
        getActive() {
            return this.active
        },
    },

    persist: process.client && {
        storage: sessionStorage,
    }
})