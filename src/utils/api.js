import { axios } from '@/utils/request'


/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url,parameter){
    return axios({
      url: url,
      params: parameter,
      method:'get' ,
      responseType: 'blob'
    })
  }