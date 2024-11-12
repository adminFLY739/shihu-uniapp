<template>
	<view class="user">
		<!-- 个人信息 -->
		<view class="status_bar">
			<!-- 这里是状态栏 -->
		</view>
		<view class="header" @click="userDetail">
			<view class="head-1">
				<image :src="userInfo.face || userImage"></image>
			</view>
			<view class="head-2" v-if="userInfo.id">
				<view class="user-name">{{ userInfo.nickName }}</view>
			</view>
			<view class="head-2" v-else>
				<view class="user-name">登录/注册</view>
			</view>
			<u-icon style="display: flex;align-items: flex-start;" name="arrow-right"></u-icon>
		</view>
		<!-- 常用工具 -->
		<tool ref="tool" @custom-event="cut_index"/>
		
		<!-- 自定义导航栏 -->
		<!-- is_lhp判断是否为刘海屏在main.js里，好像uniapp有一个css变量获取刘海屏的安全区域 -->
		<view class="tabBar" :style="{height:is_lhp?'140rpx':'98rpx'}">
			<!-- 导航的中间圆圈 -->
			<view class="border_box" :style="{paddingBottom:is_lhp?'40rpx':''}">
				<view class="tabBar_miden_border"></view>
			</view>
			<view class="tabBar_list" :style="{paddingBottom:is_lhp?'40rpx':''}">
				<view v-for="(item) in tab_nav_list" :key="item.id"
					:class="{'tabBar_item':item.id!=2,'tabBar_item2':item.id==2}" @tap="cut_index(item.id)">
					<image v-if="show_index == item.id" :src="`/static/tabbar/${item.id+1}${item.id+1}.png`">
					</image>
					<image v-else :src="`/static/tabbar/${item.id+1}.png`"></image>
					<view :class="{'tabBar_name':true,'nav_active':show_index == item.id}">{{item.name}}</view>
				</view>
			</view>
		</view>
		
		<!-- 发布弹出框 -->
		<u-modal v-model="addShow" confirm-text="发布帖子" cancel-text="发布话题" :mask-close-able="true"
			content="请选择你要发布的类型" :show-cancel-button="true" :show-title="false" @confirm="toAddPost"
			@cancel="toAddDiscuss" >
		</u-modal>
		
	</view>
</template>
<script>
	import tool from "@/pages/tabbar/user/utils/tool.vue";
	import {
		getCouponsNum,
		getFootprintNum
	} from "@/api/members.js";
	import {
		getUserWallet
	} from "@/api/members";
	import configs from '@/config/config'
	import storage from "@/utils/storage";
	export default {
		components: {
			tool,
		},
		data() {
			return {
				addShow: false, //midbuttom弹出框
				configs,
				userImage: configs.defaultUserPhoto,
				coverTransform: "translateY(0px)",
				coverTransition: "0s",
				moving: false,
				userInfo: {},
				couponNum: "",
				footNum: "",
				walletNum: "",
				//tabbar数据
				show_index: 4, //控制切换tabbar页面
				tab_nav_list: [{
					'id': 0,
					'name': '首页'
				}, {
					'id': 1,
					'name': '关注'
				}, {
					'id': 2,
					'name': '发布'
				}, {
					'id': 3,
					'name': '论坛'
				}, {
					'id': 4,
					'name': '我的'
				}], //菜单列表
				is_lhp: false
			};
		},
		onLoad() {},
		onShow() {
			this.userInfo = this.$options.filters.isLogin();
			if (this.$options.filters.isLogin("auth")) {
			} else {
				this.walletNum = 0;
				this.couponNum = 0;
				this.footNum = 0;
			}
			this.$refs.tool.allMessageNoReadCount();
			this.$refs.tool.getUserPoint();
			this.$refs.tool.loadTaskList();
		},
		onPullDownRefresh() {
			this.userInfo = this.$options.filters.isLogin();
      uni.stopPullDownRefresh();
		},
		// #ifndef MP
		onNavigationBarButtonTap(e) {
			const index = e.index;
			if (index === 0) {
				this.navigateTo("/pages/mine/set/setUp");
			}
		},
		// #endif

		mounted() {},
		methods: {
			/**
			 * 统一跳转接口,拦截未登录路由
			 * navigator标签现在默认没有转场动画，所以用view
			 */
			navigateTo(url) {
				uni.navigateTo({
					url,
				});
			},
			userDetail() {
				console.log(this.userInfo);
				if(this.userInfo.id == null){
					this.$options.filters.navigateToLogin();
				}
				else{
					this.navigateTo("/pages/mine/set/personMsg");
				}		
			},
			async getUserOrderNum() {
				uni.stopPullDownRefresh();
				let tenantId
				if (storage.getMainTenant()) {
					tenantId = storage.getMainTenant();
				} else {
					tenantId = {
						tenantId: "0"
					};
				}
				Promise.all([
					getCouponsNum(tenantId), //优惠券
					getFootprintNum(tenantId), //浏览数量
					getUserWallet(tenantId), //预存款
				]).then((res) => {
					this.couponNum = res[0].data.result;
					this.footNum = res[1].data.result;
					this.walletNum = res[2].data.result.memberWallet;
				});
			},
			
			// 切换组件
			// 切换组件
			cut_index(index) {
				console.log('----------------------------------', index);
				if (index === 0) {
					uni.reLaunch({
						url:'/pages/tabbar/home/index'
					})
				} else if (index === 1) {
					uni.reLaunch({
						url:'/pages/tabbar/follow/index',
					})
				} else if (index === 2) {
					this.addShow = true;
				} else if (index === 3) {
					uni.reLaunch({
						url:'/pages/tabbar/bbsIndex/index'
					})
				} else if (index === 4) {
					uni.reLaunch({
						url:'/pages/tabbar/user/my'
					})
				}
			},
			
			// 跳转发布帖子页面
			toAddPost() {
				uni.navigateTo({
					url: '/pages/BBS/post/add'
				});
			},
			
			// 跳转发布话题页面
			toAddDiscuss() {
				uni.navigateTo({
					url: '/pages/BBS/discuss/add'
				});
			}
		},
	};
</script>

<style lang="scss" scoped>
	html,
	body {
		overflow: auto;
	}

	.money {
		overflow: hidden;

		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.user {
		.header {
			max-width: 100%;
			padding: calc(50rpx + var(--status-bar-height)) 30rpx 0 6%;
			height: calc(var(--status-bar-height) + 360rpx);
			background-size: cover;
			border-bottom-left-radius: 30rpx;
			border-bottom-right-radius: 30rpx;
			background-image: url("/static/img/main-bg.png");
			background-position: bottom;
			background-repeat: no-repeat;
			color: #ffffff;
			display: flex;
			justify-content: space-between;

			.head-1 {
				text-align: center;
				width: 152rpx;
				position: relative;
				display: flex;
				align-items: center;

				image {
					width: 152rpx;
					height: 144rpx;
					border-radius: 50%;
					margin-bottom: 30rpx;
					border: 3px solid #fff;
				}

				.edti-head {
					position: absolute;
					width: 40rpx;
					height: 40rpx;
					border-radius: 50%;
					background-color: rgba(255, 255, 255, 0.3);
					top: 100rpx;
					right: 0;

					image {
						width: 100%;
						height: 100%;
					}
				}
			}

			.head-2 {
				flex: 1;
				margin-left: 30rpx;
				margin-top: 100rpx;
				line-height: 1;
			}

			/deep/ .u-icon,
			.u-icon {
				margin-top: 106rpx;
			}
		}

		.pointBox {
			width: 94%;
			margin: 0 3%;
			background: #fff;
			border-radius: 20rpx;
			box-shadow: 0 4rpx 24rpx 0 rgba($color: #f6f6f6, $alpha: 1);
		}

		.point {
			text-align: center;
			height: 160rpx;

			font-size: $font-sm;
			// #ifdef MP-WEIXIN
			padding: 24rpx;

			// #endif
			.u-col {
				view {
					color: $u-main-color;
					font-size: 28rpx;
				}

				view:last-child {
					margin-top: 8rpx;
					color: $main-color;
					font-size: $font-lg;
				}
			}
		}

		.order {
			height: 140rpx;
			text-align: center;
			font-size: $font-sm;
			display: flex;
			justify-content: space-around;
			align-items: center;
			padding: 0 3%;
			color: #999;

			.order-item {
				position: relative;
				line-height: 2em;
				// width: 96rpx;
				width: 160rpx;

				:first-child {
					font-size: 48rpx;
					margin-bottom: 10rpx;
				}
			}
		}
	}

	.box {
		transform: translateY(-30rpx);
	}

	.user-name {
		font-size: 34rpx;
	}

	.bag {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		margin: 0 auto;
	}

	.bag1 {
		background: #ff4a48;
	}

	.bag2 {
		background: #ff992f;
	}

	.bag3 {
		background: #009ee0;
	}

	.bag4 {
		background: #00d5d5;
	}

	.bag5 {
		background: #28ccb0;
	}
	
	//tabbar
	.tabBar {
		width: 100%;
		height: 98rpx;
		background: #fff;
		border-top: 1px solid #E5E5E5;
		position: fixed;
		bottom: 0px;
		left: 0px;
		right: 0px;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 99999;
	
		.tabBar_list {
			width: 86%;
			display: flex;
			justify-content: space-between;
	
			image {
				width: 48rpx;
				height: 48rpx;
				margin-bottom: 2rpx
			}
	
			.tabBar_item {
				width: 68rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-size: 20rpx;
				color: #969BA3;
			}
	
			.tabBar_item2 {
				width: 68rpx;
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				font-size: 20rpx;
				color: #969BA3;
				margin-top: -20rpx;
				position: relative;
				z-index: 101;
	
				image {
					width: 68rpx;
					height: 68rpx;
				}
			}
		}
	}
	
	.border_box {
		// pointer-events: none; 事件穿透解决z-index层级问题
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		left: 0px;
		bottom: 50rpx;
		z-index: 100;
		pointer-events: none;
	
		.tabBar_miden_border {
			width: 100rpx;
			height: 50rpx;
			border-top: 2rpx solid #E5E5E5;
			border-radius: 50rpx 50rpx 0 0;
			/* 左上、右上、右下、左下 */
			background: #fff;
		}
	}
	
	.nav_active {
		color: #ff573e;
	}
</style>