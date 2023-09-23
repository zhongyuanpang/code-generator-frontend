// import { defineNuxtPlugin } from '#app';
// import VxeTable from 'vxe-table';
// import 'vxe-table/lib/style.css'
//
// import XEUtils from 'xe-utils';
// import filterContent from '~/components/FilterContent.vue';
//
// export default defineNuxtPlugin(nuxtApp => {
//     nuxtApp.vueApp.component('filterContent', filterContent)
//     VxeTable.renderer.add("FilterContent", {
//         // 不显示底部按钮，使用自定义的按钮
//         showFilterFooter: false,
//         // 筛选模板
//         renderFilter(renderOpts, params) {
//             return [
//                 <filterContent params={params} attr={renderOpts.attrs}></filterContent>,
//             ];
//         },
//         // 重置数据方法
//         filterResetMethod({ options }) {
//             options.forEach((option) => {
//                 option.data = { valueArray: [], selectValue: "" };
//             });
//         },
//         // 筛选数据方法
//         filterMethod({ option, row, column }) {
//             const { valueArray } = option.data;
//             let cellValue = XEUtils.get(row, column.field);
//             return valueArray.includes(cellValue);
//         },
//     });
//
//
//     nuxtApp.vueApp.use(VxeTable)
// })


import { defineNuxtPlugin } from '#app';
import VxeTable from 'vxe-table';
import 'vxe-table/lib/style.css';

import XEUtils from 'xe-utils';
import FilterContent from '~/components/FilterContent.vue';

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