/**
 * SZLX 通用ukey js接口
 */
/* eslint-disable */
var defaultUrl="http://127.0.0.1:23418/do"

// function isIE() {
// 	var userAgent = navigator.userAgent;
// 	//alert(userAgent);
// 	var isIE = userAgent.indexOf("NET") > -1 && userAgent.indexOf("rv") > -1 ;
// 	isIE = isIE || (userAgent.indexOf("MSIE") > -1);
// 	return isIE;
// }
import $ from "jquery"
 const SZLXKEY={
    //枚举设备序列号
    EnumBySerial : function() {
		var result = null;
		$.ajax({
			url: defaultUrl,
			type : "post",
			dataType:"json",
			data : {
				order: '01000007'
			}, 
			async : false,
			success : function(data) {
				if (0 == data.rev) {
					result = data.EnumDeviceSerelList;
				} else {
					throw new Error("设备枚举失败");
				}
			},
			error : function(XMLHttpRequest, textStatus) {
				throw new Error(XMLHttpRequest.status + ";" + textStatus);
			}
		});
		return result;
	},
    // 打开设备
    OpenDeviceByIndex : function(index) {
		var handle = 0;
		$.ajax({
			url : defaultUrl,
			type : "post",
			dataType : "json",
			data : {
				order : '01000001',
				index : index
			},
			async : false,
			success : function(data) {
				if (0 == data.rev) {
					handle = 1;
				} else {
					throw new Error("设备打开失败");
				}
			},
			error : function(XMLHttpRequest, textStatus) {
				throw new Error(XMLHttpRequest.status + ";" + textStatus);
			}
		});
		return handle;
	},
	OpenDeviceBySerial : function(serialNumber){
		var handle = 0;
		$.ajax({
			url : defaultUrl,
			type : "post",
			dataType : "json",
			data : {
				order : '01000004',
				devSerial : serialNumber
			},
			async : false,
			success : function(data) {
				if (0 == data.rev) {
					handle = 1;
				} else {
					throw new Error("设备打开失败");
				}
			},
			error : function(XMLHttpRequest, textStatus) {
				throw new Error(XMLHttpRequest.status + ";" + textStatus);
			}
		});
		return handle;
	},
    // 关闭设备
	CloseDevice : function(hDev) {
		$.ajax({
			url : defaultUrl,
			type : "post",
			dataType : "json",
			data : {
				order : '01000002',
				hdevice : hDev
			},
			async : false,
			success : function(data) {
				if (0 == data.rev) {
					handle = 0;
				} else {
					throw new Error("设备关闭失败" );
				}
			},
			error : function(XMLHttpRequest, textStatus) {
				throw new Error(XMLHttpRequest.status + ";" + textStatus);
			}
		});
	},

	//操作员登录
    OperatorLogin : function(hDev, vstrPin) {
		$.ajax({
			url: defaultUrl,
			type : "post",
			dataType:"json",
			data : {
				order: '01000027',
				hdevice:hDev,
				pin:vstrPin
			}, 
			async : false,
			success : function(data){
				console.log("rev:",data)
				if (0 == data.rev) {
					return  data.rev;
				}else{
					var pinErr = "" + data.rev.toString(16);
					if(pinErr.match(/.*\83$/)){
						throw new Error("用户PIN码错误，剩余尝试次数：" + data.count);
					}else{
						throw new Error("用户登录失败");
					}
				}
			},
			error : function(XMLHttpRequest, textStatus) {
				throw new Error(XMLHttpRequest.status + ";" + textStatus);
			}
		});
		return 0;
	},
    //管理员登录
    AdminLogin : function(hDev, vstrPin) {
		$.ajax({
			url: defaultUrl,
			type : "post",
			dataType:"json",
			data : {
				order: '01000064',
				hdevice:hDev,
				pin:vstrPin
			}, 
			async : false,
			success : function(data){
				if (0 == data.rev) {
					result = data.rev;
				}else{
					var pinErr = "" + data.rev.toString(16);
					if(pinErr.match(/.*\83$/)){
						throw new Error("管理员PIN码错误，剩余尝试次数：" + data.count);
					}else{
						throw new Error("管理员登录失败");
					}
				}
			},
			error : function(XMLHttpRequest, textStatus) {
				throw new Error(XMLHttpRequest.status + ";" + textStatus);
			}
		}); 
	},

	//修改密码
	USER_ChangePin : function(hDev, vflag, oldPin, newPin) {
		//vflag 1修改操作员口令2修改管理员口令
		$.ajax({
			url: defaultUrl,
			type : "post",
			dataType:"json",
			data : {
				order: '01000029',
				hdevice:hDev,
				flag:vflag,
				oldPin:oldPin,
				pin:newPin
			}, 
			async : false,
			success : function(data){
				if (0 != data.rev) {
					if (!(1001==data.rev || 1002==data.rev)) {
						throw new Error("修改PIN码失败，剩余重试次数："+ data.count);
					} else {
						throw new Error("修改PIN码错误");
					}
				}
			},
			error : function(XMLHttpRequest, textStatus) {
				throw new Error(XMLHttpRequest.status + ";" + textStatus);
			}
		});
	},
	GetKeyRole : function(hDev){
		$.ajax({
			url: defaultUrl,
			type : "post",
			dataType:"json",
			data : {
				order: '01000063',
				hdevice:hDev
	
			}, 
			async : false,
			success : function(data){
				if (0 == data.rev) {
					result = data.devname;
				} else {
					throw new Error("获取设备角色失败");
				}
			},
			error : function(XMLHttpRequest, textStatus) {
				throw new Error(XMLHttpRequest.status + ";" + textStatus);
			}
		});
	}

}
export default SZLXKEY;