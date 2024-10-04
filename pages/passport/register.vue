<template>
	<div class="wrapper">
		<div v-if="!wechatLogin">
			<u-navbar :is-back="showBack" :border-bottom="false"></u-navbar>
			<div>
				<div class="title">{{ loginTitleWay[current].title }}</div>
				<div :class="current == 1 ? 'desc-light' : 'desc'">
					{{ loginTitleWay[current].desc}}
					<span v-if="current == 1">{{ userData.mobile | secrecyMobile }}</span>
				</div>
			</div>
			<!-- 手机号 -->
			<div v-show="!enableUserPwdBox">
				<div v-show="current == 0">
					<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入学号"
						class="mobile" focus v-model="userData.username" type="number" maxlength="13" />
					<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入密码"
						class="mobile" focus v-model="userData.password" type="password" />
					<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入姓名"
						class="mobile" focus v-model="userData.studentId" />
					<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入手机号 (11位)"
						class="mobile" focus v-model="userData.mobilePhone" type="number" maxlength="11" />
					<u-form-item>
						<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入验证码"
							class="mobile" focus v-model="userData.code" type="number" maxlength="6" />
						<div :class="!enableFetchCode ? 'disable' : 'fetch'" @click="fetchCode" class="btnCode">
							{{tips}}
						</div>
					</u-form-item>

					<div :class="!enableUserBtnColor ? 'disable' : 'fetch'" @click="register" class="btn">
						注册
					</div>


				</div>
				<!-- 输入验证码 -->
				<div v-show="current == 1" class="box-code">
					<verifyCode type="bottom" @confirm="submit" boxActiveColor="#D8D8D8" v-model="code" isFocus
						boxNormalColor="#D8D8D8" cursorColor="#D8D8D8" />

					<div class="fetch-btn">
						<u-verification-code end-text="重新获取验证码" unique-key="page-login" :seconds="seconds" @end="end"
							@start="start" ref="uCode" @change="codeChange">
						</u-verification-code>
						<span @tap="fetchCode" :style="{ color: codeColor }">
							{{ tips }}</span>
					</div>
				</div>
			</div>

			<div class="flex" v-show="current != 1">
				<u-checkbox-group :icon-size="24" width="45rpx" style="padding-top: 20px">
					<u-checkbox shape="circle" v-model="enablePrivacy" active-color="#FF5E00"></u-checkbox>
				</u-checkbox-group>
				<div class="tips">
					未注册的杭师大学生验证后将创建后账号将信息给到后台，注册信息发送即代表您已同意<span @click="navigateToPrivacy('privacy')">《隐私协议》</span>
					<span @click="navigateToPrivacys('user')">
						《用户协议》
					</span>
				</div>
			</div>

			<div v-if="current != 1" class="user-password-tips" @click="navigateToLogin()">
				返回
			</div>

			<myVerification v-if="codeFlag" @send="verification" class="verification" ref="verification"
				business="REGISTER" />
		</div>
		<view v-else>
			<wechatH5Login />
		</view>
	</div>
</template>

<script>
	import {
		openIdLogin,
		loginCallback
	} from "@/api/connect.js";
	import api from "@/config/api.js";
	import {
		sendMobile,
		smsLogin,
		userLogin
	} from "@/api/login";
	import myVerification from "@/components/verification/verification.vue"; //验证码模块
	import uuid from "@/utils/uuid.modified.js"; // uuid
	import verifyCode from "@/components/verify-code/verify-code";
	import {
		getUserInfo
	} from "@/api/members";
	import {
		whetherNavigate
	} from "@/utils/Foundation"; //登录跳转
	import storage from "@/utils/storage.js"; //缓存
	import wechatH5Login from "./wechatH5Login.vue";
	import {
		webConnect
	} from "@/api/connect.js";
	import {
		md5
	} from "@/utils/md5.js";
	import UFormItem from "../../uview-ui/components/u-form-item/u-form-item.vue";
	import {
		userRegister
	} from "../../api/login";

	export default {
		components: {
			UFormItem,
			myVerification,
			verifyCode,
			wechatH5Login
		},

		data() {
			return {
				uuid,
				wechatLogin: false, //是否加载微信公众号登录
				flage: false, //是否验证码验证
				codeFlag: true, //验证开关，用于是否展示验证码
				tips: "获取验证码",
				enableUserPwdBox: false, //帐号密码登录
				current: 0,
				codeColor: "#999", //按钮验证码颜色
				lightColor: this.$lightColor,
				seconds: 60, //默认验证码等待时间
				interval: '', // 定时器
				loginTitleWay: [{
						title: "欢迎注册",
						desc: "注册后会进行后端审核,若是杭师大学生，会通过审核，并发送短信通知",
					},
					{
						title: "请输入验证码",
						desc: "已经发送验证码至",
					},
				],
				userData: {
					username: "",
					password: "",
					mobilePhone: "", //手机号
					studentId: "",
					code: "", //验证码
				},
				code: "", //验证码
				showBack: false,
				enableFetchCode: false,
				enableUserBtnColor: false,
				enablePrivacy: false, //隐私政策

				inputStyle: {
					height: "50rpx",
					"border-bottom": "1rpx solid #D8D8D8",
					"letter-spacing": "1rpx",
					"font-size": "30rpx",
					"line-height": "30rpx",
					color: "#333",
				},
				placeholderStyle: "font-size: 30rpx;line-height: 32rpx;color: #999999;",
				loginList: [
					//第三方登录集合
					{
						icon: "weixin-fill",
						color: "#00a327",
						title: "微信",
						code: "WECHAT",
					},
					{
						icon: "qq-fill",
						color: "#38ace9",
						title: "QQ",
						code: "QQ",
					},
					{
						icon: "apple-fill",
						color: "#000000",
						title: "Apple",
						code: "APPLE",
					},
				],
			};
		},
		onShow() {

			// 只要是app登录的全部清除内容
			// #ifdef APP-PLUS
			storage.setAccessToken("");
			storage.setRefreshToken("");
			storage.setUserInfo({});
			// #endif


			//#ifdef H5
			let isWXBrowser = /micromessenger/i.test(navigator.userAgent);
			if (isWXBrowser) {
				webConnect("WECHAT").then((res) => {
					let data = res.data;
					if (data.success) {
						window.location = data.result;
					}
				});
			}
			//#endif
		},

		mounted() {
			uni.showModal({
				title: '提示',
				content: '本程序只是杭师大学生内部使用，获取学生手机号只用于身份验证，方便登录，修改密码',
				success: function(res) {
					if (res.confirm) {
						// 执行确认后的操作
					} else {
						// 执行取消后的操作
					}
				}
			})

			// #ifndef APP-PLUS
			//判断是否微信浏览器
			var ua = window.navigator.userAgent.toLowerCase();
			if (ua.match(/MicroMessenger/i) == "micromessenger") {
				this.wechatLogin = true;
				return;
			}
			// #endif
			/**
			 * 条件编译判断当前客户端类型
			 */
			//#ifdef H5
			this.clientType = "H5";
			//#endif

			//#ifdef APP-PLUS
			this.clientType = "APP";
			/**如果是app 加载支持的登录方式*/
			let _this = this;
			uni.getProvider({
				service: "oauth",
				success: (result) => {
					_this.loginList = result.provider.map((value) => {
						//展示title
						let title = "";
						//系统code
						let code = "";
						//颜色
						let color = "#8b8b8b";
						//图标
						let icon = "";
						//uni 联合登录 code
						let appcode = "";
						switch (value) {
							case "weixin":
								icon = "weixin-circle-fill";
								color = "#00a327";
								title = "微信";
								code = "WECHAT";
								break;
							case "qq":
								icon = "qq-circle-fill";
								color = "#38ace9";
								title = "QQ";
								code = "QQ";
								break;
							case "apple":
								icon = "apple-fill";
								color = "#000000";
								title = "Apple";
								code = "APPLE";
								break;
						}
						return {
							title: title,
							code: code,
							color: color,
							icon: icon,
							appcode: value,
						};
					});
				},
				fail: (error) => {
					uni.showToast({
						title: "获取登录通道失败" + error,
						duration: 2000,
						icon: "none",
					});
				},

			});
			//#endif

			//特殊平台，登录方式需要过滤
			// #ifdef H5
			// this.methodFilter(["QQ"]);
			// #endif

			//微信小程序，只支持微信登录
			// #ifdef MP-WEIXIN
			// this.methodFilter(["WECHAT"]);
			// #endif

		},
		watch: {
			current(val) {
				val ? (this.showBack = true) : (this.showBack = false);
			},
			userData: {
				handler(val) {
					if (this.userData.username && this.userData.password && this.userData.studentId && this.userData
						.code && this.userData.mobilePhone) {
						this.enableUserBtnColor = true;
					} else {
						this.enableUserBtnColor = false;
					}
					if (this.userData.mobilePhone.length === 11) {
						this.enableFetchCode = true;
					}
				},
				deep: true,

			},


			async flage(val) {
				if (val) {
					if (this.$refs.uCode.canGetCode) {
						if (this.enableUserPwdBox) {
							this.submitUserLogin();
							return;
							// 执行登录
						} else {
							// 向后端请求验证码
							uni.showLoading({});
							let res = await sendMobile(this.userData.mobilePhone, "REGISTER");
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							if (res.data.success) {
								//this.current = 1;
								this.$refs.uCode.start();
								let that = this;
								this.interval = setInterval(() => {
									that.seconds--;
									if (that.seconds === 0) {
										that.seconds = 60;
										that.tips = '重新发送';
										that.flage = false;
										clearInterval(that.interval);
									} else {
										that.codeMsg = that.time;
									}
								}, 1000);
							} else {
								uni.showToast({
									title: res.data.message,
									duration: 2000,
									icon: "none",
								});
								this.flage = false;
								this.$refs.verification.getCode();
							}
						}
					} else {
						!this.enableUserPwdBox ? this.$u.toast("请倒计时结束后再发送") : "";
					}
				} else {
					this.$refs.verification.hide();
				}
			},
		},
		onLoad(options) {
			if (options && options.state) {
				this.stateLogin(options.state);
			}
		},
		methods: {
			/**跳转到登录页面 */
			navigateLogin(connectLogin) {
				// #ifdef H5
				let code = connectLogin.code;
				let buyer = api.buyer;
				window.open(
					buyer + `/passport/connect/connect/login/web/` + code,
					"_self"
				);
				// #endif
				// #ifdef APP-PLUS
				this.nonH5OpenId(connectLogin);
				// #endif
			},


			// 验证码验证
			verification(val) {
				this.flage = val == this.$store.state.verificationKey ? true : false;
			},
			// 跳转
			navigateToPrivacy(val) {
				uni.navigateTo({
					url: "/pages/mine/help/tips?type=" + val,
				});
				console.log(val)
			},
			navigateToPrivacys(val) {
				uni.navigateTo({
					url: "/pages/mine/help/tips?type=" + val,
				})
			},
			// 跳转到登录界面
			navigateToLogin() {
				uni.navigateTo({
					url: `/pages/passport/login`,
				});
			},
			// 点击获取验证码
			start() {
				this.codeColor = "#999";
				this.$u.toast("验证码已发送");
				this.flage = false;
				this.codeFlag = false;

				this.$refs.verification.hide();
			},
			/**点击验证码*/
			codeChange(text) {
				this.tips = text;
			},
			/** 结束验证码后执行 */
			end() {
				this.codeColor = this.lightColor;
				this.codeFlag = true;
				console.log(this.codeColor);
			},

			register() {
				if (!this.enablePrivacy) {
					uni.showToast({
						title: "请同意用户隐私",
						duration: 2000,
						icon: "none",
					});
					return false;
				}

				if (!this.userData.username) {
					uni.showToast({
						title: "请填写学号",
						duration: 2000,
						icon: "none",
					});
					return false;
				}

				if (!this.userData.password) {
					uni.showToast({
						title: "请填写密码",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				if (!this.userData.studentId) {
					uni.showToast({
						title: "请填写姓名",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				if (!this.userData.mobilePhone) {
					uni.showToast({
						title: "请填手机号",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				if (!this.userData.code) {
					uni.showToast({
						title: "请填验证码",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				this.submitUserLogin();
			},

			// 提交用户登录
			async submitUserLogin() {
				const params = JSON.parse(JSON.stringify(this.userData));
				params.password = md5(params.password);
				try {
					let res = await userRegister(params, this.clientType);
					if (res.data.success) {
						uni.showModal({
							title: "提示",
							content: "注册信息已成功发送到后台，请等待后台审核，审核通过后有短信通知",
							showCancel: true,
							cancelText: '确定',
							confirmText: '取消',
							success: res => {
								if (!res.confirm) {
									this.navigateToLogin();
								}
							}
						})
					} else {
						this.$refs.verification.getCode();
						this.flage = false;
					}
				} catch (error) {
					this.$refs.verification.getCode();
				}
			},

			// 发送验证码
			fetchCode() {
				if (!this.enablePrivacy) {
					uni.showToast({
						title: "请同意用户隐私",
						duration: 2000,
						icon: "none",
					});
					return false;
				}

				if (!this.$u.test.mobile(this.userData.mobilePhone)) {
					uni.showToast({
						title: "请填写正确手机号",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				if (this.tips == "重新获取验证码") {
					uni.showLoading({
						title: "加载中",
					});
					if (!this.codeFlag) {
						let timer = setInterval(() => {
							if (this.$refs.verification) {
								this.$refs.verification.error(); //发送
							}
							clearInterval(timer);
						}, 100);
					}
					uni.hideLoading();
				}
				if (!this.flage) {
					this.$refs.verification.error(); //发送
					return false;
				}
			},
		},
	};
</script>
<style>
	page {
		background: #fff;
	}
</style>
<style lang="scss" scoped>
	.wrapper {
		padding: 0 80rpx;
	}

	.title {
		padding-top: calc(10rpx);
		font-style: normal;
		line-height: 1;
		font-weight: 500;
		font-size: 56rpx;
		color: #333;
	}

	.box-code {
		margin-top: 78rpx;
	}

	.desc,
	.desc-light {
		font-size: 32rpx;
		line-height: 32rpx;
		color: #333333;
		margin-top: 40rpx;
	}

	.desc {
		color: #333;
	}

	.desc-light {
		color: #999999;

		>span {
			color: #333;
			margin-left: 8rpx;
		}
	}

	.mobile {
		margin-top: 60rpx;
	}

	.disable {
		background: linear-gradient(90deg, #ffdcba 2.21%, #ffcfb2 99.86%);
	}

	.fetch {
		background: linear-gradient(57.72deg, #ff8a19 18.14%, #ff5e00 98.44%);
	}

	.btn {
		border-radius: 100px;
		width: 590rpx;
		margin-top: 20rpx;
		height: 80rpx;
		font-size: 30rpx;
		line-height: 80rpx;
		text-align: center;
		color: #ffffff;
	}

	.btnCode {
		border-radius: 70px;
		width: 200rpx;
		margin-top: 60rpx;
		height: 80rpx;
		font-size: 20rpx;
		line-height: 80rpx;
		text-align: center;
		color: #ffffff;
	}


	.tips {
		font-size: 12px;
		line-height: 20px;
		margin-top: 32rpx;
		width: 546rpx;

		>span {
			color: $light-color;
		}
	}

	.fetch-btn {
		width: 370rpx;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: #f2f2f2;
		border-radius: 100rpx;
		font-size: 28rpx;
		color: #999;

		margin: 71rpx auto 0 auto;
	}

	.login-list {
		display: flex;
		width: 590rpx;
		position: absolute;
		top: 1200rpx;
		align-items: center;
		justify-content: center;
	}

	.login-item {
		width: 80rpx;
		border-radius: 10rpx;
		height: 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;

		margin: 0 20rpx;
	}

	.user-password-tips {
		text-align: center;
		color: $main-color;
		margin: 20px 0;
	}
</style>