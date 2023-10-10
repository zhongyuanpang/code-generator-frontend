import { defineNuxtPlugin } from '#app';
import VxeTable from 'vxe-table';
import 'vxe-table/lib/style.css';

import XEUtils from 'xe-utils';
import FilterContent from '~/composables/FilterContent.vue';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('filterContent', FilterContent)
    VxeTable.renderer.add('FilterContent', {
        showFilterFooter: false,
        renderFilter(renderOpts, params) {
            return [
                h(FilterContent, { params, attr: renderOpts.attrs })
            ];
        },
        filterResetMethod({ options }) {
            options.forEach((option) => {
                option.data = { valueArray: [], selectValue: '' };
            });
        },
        filterMethod({ option, row, column }) {
            const { valueArray } = option.data;
            let cellValue = XEUtils.get(row, column.field);
            return valueArray.includes(cellValue);
        },
    });

    nuxtApp.vueApp.use(VxeTable)
});