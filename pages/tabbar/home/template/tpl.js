/** 配置楼层模块的跳转 */
export function modelNavigateTo(item) {
	let val = item.url || item;
	//链接跳转到专题

	if (val && val.id && val.pageType == "special") {
		uni.navigateTo({
			url: `/pages/tabbar/special/special?id=${val.id}`,
		});
	}
	switch (val.___type || val.type) {
		case "pages":
			uni.navigateTo({
				url: val.___path + "?id=" + val.id + "&title=" + val.title,
			});
			break;
		case "other":
			switch (val.title || item.title) {
				case "首页":
					uni.switchTab({
						url: `/pages/tabbar/home/index`,
					});
					break;
				case "个人中心":
					uni.switchTab({
						url: `/pages/tabbar/user/my`,
					});
					break;
				default:
					// #ifdef H5
					window.location.href = val.url || item.link;
					// #endif
					// #ifdef APP-PLUS
					plus.runtime.openURL(val.url || item.link) //不需要拼接\
					// #endif
					break;
			}

			break;
	}
}




import config from "@/config/config";

async function scan() {
	// #ifdef APP-PLUS
	let isIos = plus.os.name == "iOS";
	// 判断是否是Ios
	if (isIos) {
		const iosFirstCamera = uni.getStorageSync("iosFirstCamera"); //是不是第一次开启相机
		if (iosFirstCamera !== "false") {
			uni.setStorageSync("iosFirstCamera", "false"); //设为false就代表不是第一次开启相机
			seacnCode();
		} else {
			if (permision.judgeIosPermission("camera")) {
				seacnCode();
			} else {
				// 没有权限提醒是否去申请权限
				tipsGetSettings();
			}
		}
	} else {
		/**
		 * TODO 安卓 权限已经授权了，调用api总是显示用户已永久拒绝申请。人傻了
		 * TODO 如果xdm有更好的办法请在 https://gitee.com/beijing_hongye_huicheng/lilishop/issues 提下谢谢
		 */
		seacnCode();
	}

	// #endif

	// #ifdef MP-WEIXIN
	seacnCode();
	// #endif
}
/**
 * 提示获取权限
 */
function tipsGetSettings() {
	uni.showModal({
		title: "提示",
		content: "您已经关闭相机权限,去设置",
		success: function(res) {
			if (res.confirm) {
				if (isIos) {
					plus.runtime.openURL("app-settings:");
				} else {
					permision.gotoAppPermissionSetting();
				}
			}
		},
	});
}

function seacnCode() {
	uni.scanCode({
		success: function(res) {
			let path = encodeURIComponent(res.result);

			// WX_CODE 为小程序码
			if (res.scanType == "WX_CODE") {
				console.log(res);
				uni.navigateTo({
					url: `/${res.path}`,
				});
			} else {
				config.scanAuthNavigation.forEach((src) => {
					if (res.result.indexOf(src) != -1) {
						uni.navigateTo({
							url: `/${res.result.substring(src.length)}`,
						});
					} else {
						setTimeout(() => {
							uni.navigateTo({
								url: "/pages/tabbar/home/web-view?src=" + path,
							});
						}, 100);
					}
				});
			}
		},
	});
}