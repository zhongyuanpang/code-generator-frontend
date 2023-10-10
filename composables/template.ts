import {Http} from "~/utils/request";

/**
 * 获取当前数据库下的所有表信息
 * @param database
 */
export const getAllTable = (dataBase: string) => {
    const obj = {
        method: "get",
        url: '/datasource/getAllTable',
        query: {
            dataBase: dataBase
        }
    }
    return Http(obj)
}

/**
 * 根据表名获取字段信息
 * @param params
 */
export const getTableColumnInfo = (params: any) => {
    const obj = {
        method: "post",
        url: '/datasource/getTableColumnInfo',
        body: params
    }
    return Http(obj)
}