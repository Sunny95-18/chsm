import conf from '@/conf/'
var millisecond = new Date().getTime();
var expiresTime = new Date(millisecond + 60 * 1000 * 15 );  //15分钟过期

export const setToken = (token) => {
    // console.log("time:"+expiresTime)
    Cookies.set(conf.tokenKey, token, { expires: expiresTime })
    // Cookies.set(conf.tokenKey,token);
    // sessionStorage.setItem(conf,tokenKey,token);
}

export const getToken = () => {
    return Cookies.get(conf.tokenKey);
    // return sessionStorage.getItem(conf.tokenKey);
}

export const removeToken = () => {
    return Cookies.remove(conf.tokenKey);
    // return sessionStorage.removeItem(conf.tokenKey);
}