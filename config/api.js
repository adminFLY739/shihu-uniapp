/**
 * base    : 基础业务API
 * buyer   : 买家API
 */
// 开发环境
const dev = {
	// im: "http://127.0.0.1:8885",
	// common: "http://127.0.0.1:8890",
	// buyer: "http://127.0.0.1:8888",
	// seller: "http://127.0.0.1:8889",
	
	// im: "http://121.43.34.227:8885",
	// common: "http://121.43.34.227:8890",
	// buyer: "http://121.43.34.227:8888",
	// seller: "http://121.43.34.227:8889",
	
	common: "https://common-api.hznush.com",
	buyer: "https://buyer-api.hznush.com",
	// seller: "https://seller-api.hznush.com",
	// manager: "https://admin-api.hznush.com",
	// im: "https://im-api.hznush.com",
};
// 生产环境
const prod = {
	// im: "http://127.0.0.1:8885",
	// common: "http://127.0.0.1:8890",
	// buyer: "http://127.0.0.1:8888",
	// seller: "http://127.0.0.1:8889",
	// manager: "http://127.0.0.1:8887",
	
	// im: "http://121.43.34.227:8885",
	// common: "http://121.43.34.227:8890",
	// buyer: "http://121.43.34.227:8888",
	// seller: "http://121.43.34.227:8889",
	// manager: "http://121.43.34.227:8887",
	
	common: "https://common-api.hznush.com",
	buyer: "https://buyer-api.hznush.com",
	// seller: "https://seller-api.hznush.com",
	// manager: "https://admin-api.hznush.com",
	// im: "https://im-api.hznush.com",
};

//默认生产环境
let api = dev;
//如果是开发环境
if (process.env.NODE_ENV == "development") {
	api = dev;
} else {
	api = prod;
}
//微信小程序，app的打包方式建议为生产环境，所以这块直接条件编译赋值
// #ifdef MP-WEIXIN || APP-PLUS
api = prod;
// #endif

api.buyer += "/buyer";
api.common += "/common";
api.im += "/im";
export default {
	...api,
};