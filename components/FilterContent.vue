<template>
  <div class="my-filter-content">
    <div class="my-fc-search">
      <div class="my-fc-search-top">
        <Row align="middle" type="flex" :gutter="5" >
          <Col style="text-align:center;" :span="5">
            <Checkbox  style="margin-left:3px;margin-top: 3px;" v-model="isAll" @on-change="changeAllEvent"
            >全选</Checkbox
            >
          </Col>
          <Col :span="11">
            <Input
                v-model="option.data.sVal"
                placeholder="搜索"
                @input="searchEvent"
                suffix-icon="fa fa-search"
                size="small"
            ></Input>
          </Col>
          <Col :span="4">
            <Button size="small"  v-width="'100%'" @click="confirmFilterEvent"
            >筛选</Button
            >
          </Col>
          <Col :span="4">
            <Button size="small"  v-width="'100%'" @click="resetFilterEvent"
            >重置</Button
            >
          </Col>
        </Row>
      </div>
      <div class="my-fc-search-content">
        <template v-if="valList.length">
          <ul class="my-fc-search-list my-fc-search-list-body">
            <li
                class="my-fc-search-item"
                v-for="(item, sIndex) in valList"
                :key="sIndex"
            >
              <Checkbox
                  v-if="Boolean(attr[item.value])"
                  v-model="item.checked"
              >
                {{ attr[item.value] }}
              </Checkbox>
              <Checkbox v-else v-model="item.checked">{{
                  item.value
                }}</Checkbox>
            </li>
          </ul>
        </template>
        <template v-else>
          <div class="my-fc-search-empty">无匹配项</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "FilterContent",
        props: {
            params: Object,
            attr: {
                default() {
                    return {
                        null: "(空)",
                        "": "空",
                    };
                },
                type: Object,
            },
        },
        data() {
            return {
                size: "mini",
                isAll: false,
                option: { data: { sVal: `` } },
                colValList: [],
                valList: [],
            };
        },
        mounted() {
            this.load();
        },
        methods: {
            load() {
                if (!this.params) return;
                const { $table, column } = this.params;
                const { fullData } = $table.getTableData();
                const option = column.filters[0];
                const { vals } = option.data;

                let colValList = [];

                fullData.forEach((i) => {
                    const val = i[column.field];
                    const index = colValList.findIndex((i2) => {
                        return i[column.field] === i2.value;
                    });
                    if (index === -1) {
                        colValList.push({
                            checked: vals.includes(val),
                            value: val,
                        });
                    }
                });

                colValList.sort((i1, i2) => {
                    return i1.value > i2.value ? 1 : -1;
                });

                this.option = option;
                this.colValList = colValList;
                this.valList = colValList;
            },
            searchEvent() {
                const { option, colValList } = this;
                this.valList = option.data.sVal
                    ? colValList.filter(
                        (item) => String(item.value).indexOf(option.data.sVal) > -1
                    )
                    : colValList;
            },
            changeAllEvent() {
                const { isAll } = this;
                this.valList.forEach((item) => {
                    item.checked = isAll;
                });
            },
            confirmFilterEvent($event) {
                const { params, option, valList } = this;
                const { data } = option;
                const { $panel } = params;
                data.vals = valList
                    .filter((item) => item.checked)
                    .map((item) => item.value);

                //判断如果有筛选数据则渲染其数据
                if (data.vals.length > 0) {
                    $panel.changeOption($event, true, option);
                    $panel.confirmFilter();
                } else {
                    //否则重置筛选
                    $panel.resetFilter();
                }
            },
            resetFilterEvent() {
                const { $panel } = this.params;
                $panel.resetFilter();
            },
        },
    };
</script>

<style scoped>
.my-filter-content {
  padding: 1px;
  user-select: none;
  padding: 3px;
}

.my-filter-content .my-fc-search .my-fc-search-top {
  position: relative;
  padding: 3px 0;
  /*border: 1px solid #000;*/
}

.my-filter-content .my-fc-search .my-fc-search-top > input {
  border: 1px solid #ababab;
  padding: 0 5px 0 2px;
  width: 200px;
  height: 10px;
  line-height: 10px;
}

.my-filter-content .my-fc-search .my-fc-search-content {
  padding: 2px 5px;
}

.my-filter-content .my-fc-search-empty {
  text-align: center;
  padding: 5px 0;
}

.my-filter-content .my-fc-search-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.my-filter-content .my-fc-search-list-body {
  overflow: auto;
  min-height: 20px;
  max-height: 120px;
}

.my-filter-content .my-fc-search-list .my-fc-search-item {
  line-height: 1.2em;
  padding: 0px 0;
  display: block;
}


.my-fc-search-content ul {
  text-align: left;
}
</style>
