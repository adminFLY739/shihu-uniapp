<template>
	<view class="wrapper">
		<u-navbar :is-back="showBack" :border-bottom="false"></u-navbar>
		<div>
			<div class="title">实名认证</div>
			<div class="desc">
				信息提交后会进行后台审核，若是杭师大学生，会通过审核，并发送短信通知
			</div>
		</div>
		<div>
			<div>
				<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入学号"
					class="mobile" focus v-model="userData.username" type="number" maxlength="13" />
				<u-input :custom-style="inputStyle" :placeholder-style="placeholderStyle" placeholder="请输入姓名"
					class="mobile" focus v-model="userData.studentId" />

				<div :class="!enableUserBtnColor ? 'disable' : 'fetch'" @click="applying" class="btn">
					提交
				</div>
			</div>
		</div>

		<div class="flex" >
			
			<u-checkbox-group :icon-size="24" width="45rpx" style="padding-top: 20px">
				<u-checkbox shape="circle" v-model="enablePrivacy" active-color="#FF5E00"></u-checkbox>
			</u-checkbox-group>
			
			<div class="tips">
				未实名认证的用户将提交信息给到后台审核，确定发送即代表您已同意
				<span @click="navigateToPrivacy('PRIVACY_POLICY')">《隐私协议》</span>
				<span @click="navigateToPrivacy('USER_AGREEMENT')">《用户协议》</span>
			</div>
		</div>

		<div class="user-password-tips" @click="navigateToBack()">
			返回
		</div>
	</view>
</template>

<script>
	import api from "@/config/api.js";
	import storage from "@/utils/storage.js"; //缓存
	import {userRealNameApplying} from "@/api/members.js";
	import {getUserInfo} from "@/api/members";

	export default {
		data() {
			return {
				codeColor: "#999", //按钮验证码颜色
				userData: {
					id: storage.getUserInfo().id,
					username: "",
					studentId: "",
				},
				showBack: false,
				enableUserBtnColor: false,//提交按钮是否可以点击
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
			};
		},
		onShow() {
			// console.log("storage.getUserInfo():",storage.getUserInfo());
		},

		mounted() {
			uni.showModal({
				title: '提示',
				content: '本程序只是杭师大学生内部使用，获取学号和姓名只用于身份验证',
				success: function(res) {
					if (res.confirm) {
						// 执行确认后的操作
					} else {
						// 执行取消后的操作
					}
				}
			})
		},
		watch: {
			current(val) {
				val ? (this.showBack = true) : (this.showBack = false);
			},
			userData: {
				handler(val) {
					//用户填写学号和姓名后才可以提交审核
					if (this.userData.username && this.userData.studentId) {
						this.enableUserBtnColor = true;
					} else {
						this.enableUserBtnColor = false;
					}
				},
				deep: true,
			},
		},
		onLoad() {
		},
		methods: {

			// 跳转
			navigateToPrivacy(val) {
				uni.navigateTo({
					url: "/pages/mine/help/tips?type=" + val,
				});
				console.log(val)
			},
			// 返回
			navigateToBack() {
				uni.navigateBack()
			},

			// 审核申请
			async applying() {
				//获取用户信息判断实名认证状态
				let user = await getUserInfo();
				storage.setUserInfo(user.data.result);
				
				let userInfo = storage.getUserInfo();
				console.log("userInfo:",userInfo);
				if(userInfo.disabled){
					uni.showToast({
						title: "您已经完成实名认证，无需再次认证",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				
				if(userInfo.studentId != null && userInfo.studentId != undefined && userInfo.studentId != ""){
					uni.showToast({
						title: "您的实名申请已经在审核中，请耐心等待审核结果",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				
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

				if (!this.userData.studentId) {
					uni.showToast({
						title: "请填写姓名",
						duration: 2000,
						icon: "none",
					});
					return false;
				}
				
				//提交审核
				this.submitUserApplying();
			},

			// 提交用户审核
			async submitUserApplying() {
				console.log(111)
				const params = JSON.parse(JSON.stringify(this.userData));
				try {
					let res = await userRealNameApplying(params);
					if (res.data.success) {
						//更新缓存中的userInfo
						let userInfo = storage.getUserInfo();
						userInfo.studentId = this.userData.studentId;
						storage.setUserInfo(userInfo);
						
						uni.showModal({
							title: "提示",
							content: "实名信息已成功发送到后台，请等待后台审核，审核通过后有短信通知",
							showCancel: true,
							cancelText: '确定',
							// confirmText: '取消',
							success: res => {
								if (res.confirm) {
									uni.navigateBack()
								}
							}
						})
					}
				} catch (error) {
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