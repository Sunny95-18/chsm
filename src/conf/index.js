/**
 * 实现apiServer可在线上修改
 * 
 */
import { serverInfo } from "../../public/application"
let server = "http://192.168.88.19:8080/";  //本地
// let server = "http://192.168.88.214:8080/";   //linux下中创

// let server = "http://192.168.88.202:8088/";   //linux jar包
// let server="http://localhost:8080/"; //tomcat
// let server=serverInfo.server;
// let server="http://"+getUserIP()+":8080/"
// if(window.AppServerInfo && typeof(AppServerInfo) == 'function') {
//   server = AppServerInfo().getServerInfo("server");
//   console.log("server:",server)
// }
/**
 * 配置信息
 */
const conf = {
    /**
     * 协议 http/https
     */
    schema: "http://",
    /**
     * ip和端口
     */
    // server:"192.168.88.19:8088",
    server:server,
    // server:"192.168.88.233:8088",
    /**
     * 上下文
     */
    context: "/",
    /**
     * 默认服务 - 处理部分资源数据的加载（写服务）
     */
    defaultServer: server,
    /**
     * api服务地址
     */
    apiServer: server,
    /**
     * 写服务api地址
     */
    writeApiServer: server,
    /**
     * 是否读写分离
     */
    readWriteSplitting: true,
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: 'CCEE - UI',
    /**
     * @description token 的标识
     * 
     */
    tokenKey: "Authorization",
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    tokenExpires: 1,
    /**
     * @description 是否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: true,
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home_index',
    
    /**
     * @description 响应状态码
     */
    responseCodes: {
      success: "200"
    },
    /**
     * @description 响应错误
     */
    responseErrors: {
      serverError: "服务端错误"
    },
     /**
     * @description 请求格式统一
     */
    requestData: {
      data: {}
    },
  }
  
  /**
   * 切换服务地址
   * @param {*} server 
   */
  export const setApiServer = (server) => {
    conf.server = server;
    if(server.indexOf(conf.schema) > -1) {
      conf.apiServer = server;
    } else {
      conf.apiServer = conf.schema + server + conf.context;
    }
    if(!conf.readWriteSplitting) {
      // 如果不是读写分离，统一使用节点下面的服务
      // 否则使用主节点服务server
      conf.writeApiServer = conf.apiServer;
    }
  }

  export default conf;