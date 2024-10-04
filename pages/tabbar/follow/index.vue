<template>
	<view class="wrapper">
		
		<u-navbar :is-back="false" z-index="99999">
			<!-- 关注 -->
			<u-tabs :list="tabList" font-size="35" bg-color="#fff" :current="current" @change="change"></u-tabs>
			<view slot="right" class="navbar-right">
				<view class="talk-time">
					<u-badge type="error" is-center absolute :count="allMessageUnReadCount" ></u-badge>
				</view>
				<u-icon name="bell" @click="linkMsgDetail" color="#666" size="50"></u-icon>
			</view>
		</u-navbar>
		
		
		<!-- 关注问题 -->
		<view v-if="current === 0">
			<block v-for="(item, index) in discussList" :key="item.id">
				<view @click="jumpToDiscuss(item)">
					<view class="discuss-item">
						<view class="discussList-item">
							<view class="center">
								<view style="display: flex;align-items: center;">
									<!-- 用户头像 -->
									<u-avatar class="avatar" :src="item.userInfo.face" size="60" @click.stop="toUser(item.uid)"></u-avatar>
									<!-- 用户名 -->
									<text class="username" @click.stop="toUser(item.uid)">{{ item.userInfo.nickName.substring(0, 10) }}</text>
									<image class="level" :src="`/static/level/level_${item.level}.png`" ></image>
								</view>
								<view style="height: 10rpx"></view>
								<!-- 话题标题 -->
								<text class="title">{{item.title}}</text>
			
								<view style="height: 20rpx"></view>
								<view>
									{{item.readCount}} <span class="liulanliang">浏览量</span>  · 
									{{item.postCount}} <span class="huida">回答</span>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			
			<!-- 加载状态 -->
			<block v-if="discussList.length === 0 && loadStatus1 == 'nomore'">
				<u-empty margin-top="100" text="暂无关注话题" mode="favor"></u-empty>
			</block>
			<block v-else>
				<view style="margin: 30rpx 0;">
					<u-loadmore :status="loadStatus1" />
				</view>
			</block>
			
		</view>
		
		<!-- 关注的人 -->
		<view v-if="current === 1">
			<block v-for="(item, index) in followUserList" :key="index">
				<navigator :url="'/pages/BBS/user/home?uid=' + item.id" class="user-list-item">
					<u-avatar class="avatar" :src="item.face"></u-avatar>
					<view class="user">
						<text class="name">{{ item.nickName }}</text>
					</view>
					<image class="level" :src="`/static/level/level_${item.level}.png`" ></image>
					
					<u-button @click="follow(index, item.id)" v-if="item.hasFollow === 0" class="btn-gz" type="default"
						size="mini">关注</u-button>
					<u-button @click="cancelFollow(index, item.id)" v-if="item.hasFollow === 1" class="btn-gz"
						type="default" size="mini" plain>互相关注</u-button>
					<u-button @click="cancelFollow(index, item.id)" v-if="item.hasFollow === 2" class="btn-gz"
						type="default" size="mini" plain>已关注</u-button>
				</navigator>
			</block>
			<!-- 加载状态 -->
			<block v-if="loadStatus2 != 'none'">
				<block v-if="followUserList.length === 0 && loadStatus2 == 'nomore'">
					<u-empty margin-top="100" text="暂无关注用户" mode="favor"></u-empty>
				</block>
				<block v-else>
					<u-loadmore margin-bottom="50" margin-top="50" :status="loadStatus2" />
				</block>
			</block>
		</view>
		
		

		
		
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
	import {
		followDiscuss,
		userFollow,
		cancelFollow,
		addFollow,
		getAllMessageNoReadCount
	} from "@/api/bbs";
	
	export default {
		data() {
			return {
				allMessageUnReadCount: 0,
				current: 0, //tabs索引
				discussList: [],
				followUserList: [],
				addShow: false, //midbuttom弹出框
				//tabbar数据
				show_index: 1, //控制切换tabbar页面
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
				is_lhp: false,
				pageNumber1: 1,
				pageNumber2: 1,
				loadStatus1: 'loadmore',
				loadStatus2: 'loadmore',
				tabList: [{
						name: '话题'
					},
					{
						name: '用户'
					}
				],
			};
		},
		methods: {
			//切换tabs
			change(index) {
				this.current = index;
			},
			
			//获取帖子
			loadData() {
				this.getFollowDiscuss();
				this.getFollowUserList();
			},
			
			//获取关注的话题列表
			getFollowDiscuss() {
				this.loadStatus1 = 'loading';
				// this.discussList = [];
				followDiscuss(this.pageNumber1).then((res) => {
					// 更新加载状态
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page === 0) {
						this.loadStatus1 = 'nomore';
					} else {
						this.loadStatus1 = 'loadmore';
					}
					
					//第一页的数据直接覆盖原数据，否则将新数据添加在原数据后边
					if (this.pageNumber1 === 1) {
						this.discussList = res.data.result.data;
					} else {
						this.discussList = this.discussList.concat(res.data.result.data);
					}
					console.log("discussList", this.discussList);
				});
			},
			
			//获取关注的人列表
			getFollowUserList() {
				this.loadStatus2 = 'loading';
				userFollow(this.pageNumber2).then((res) => {
					// 更新加载状态
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page === 0) {
						this.loadStatus2 = 'nomore';
					} else {
						this.loadStatus2 = 'loadmore';
					}
					
					//第一页的数据直接覆盖原数据，否则将新数据添加在原数据后边
					if (this.pageNumber2 === 1) {
						this.followUserList = res.data.result.data;
					} else {
						this.followUserList = this.followUserList.concat(res.data.result.data);
					}
					console.log("followUserList", this.followUserList);
				});
			},
			
			// 跳转到话题详情
			jumpToDiscuss(item) {
				console.log("item",item);
				uni.navigateTo({
					url: '/pages/BBS/discuss/discuss?id=' + item.id+"&uid="+item.uid
				});
			},
			
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
			},
			
			toUser(uid) {
				uni.navigateTo({
					url: '/pages/BBS/user/home?uid=' + uid
				});
			},
			
			//加载新分页数据
			loadmore() {
				if(this.current === 0){
					this.pageNumber1++;
					this.getFollowDiscuss();
				}else{
					this.pageNumber2++;
					this.getFollowUserList();
				}
			},
			
			follow(index, id) {
				let followForm = {
					id: id
				}
				addFollow(followForm).then((res) => {
					if (res.data.code === 0) {
						this.followUserList[index].hasFollow = 2;
					} else {
						this.$refs.uToast.show({
							title: res.data.msg,
							type: 'error'
						});
					}
				});
			},
			cancelFollow(index, id) {
				let followForm = {
					id: id
				}
				cancelFollow(followForm).then((res) => {
					if (res.data.code === 0) {
						this.followUserList[index].hasFollow = 0;
					}
				});
			},
			
			// 获取消息未读数
			allMessageNoReadCount() {
				getAllMessageNoReadCount().then((res) => {
					this.allMessageUnReadCount = res.data.result;
				});
			},
			
			linkMsgDetail() {
				uni.navigateTo({
					url: `/pages/mine/message/list`,
				});
			},
			
		},
		
		//触底加载
		onReachBottom() {
			// 给子级监听触底加载
			uni.$emit('onReachBottom', true)
			this.loadmore();
		},
		
		onShow() {
			this.loadData();
			this.allMessageNoReadCount();
		},	
		
		// 下拉刷新
		// onPullDownRefresh() {
		// 	this.pageNumber = 1;
		// 	this.discussList = [];
		// 	this.getFollowDiscuss();
		// 	uni.stopPullDownRefresh();
		// },
		
	}
</script>

<style lang="scss">
	.navbar-right {
		padding: 0 16rpx 0 0;
	}
	
	.talk-time {
		position: relative;
	}
	
	
	//话题样式
	.discuss-item {
		background: #fff;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.post-content {
			margin-top: 20rpx;

		}
	}

	.discussList-item {
		display: flex;
		align-items: center;

		.center {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 24rpx;
			color: #999;

			.title {
				font-size: 32rpx;
				font-weight: 600;
				color: #616161;
			}

			.username{
				color: #000;
				margin-left: 10rpx;
			}
			
			.level{
				height: 27rpx;
				width: 60rpx;
				min-height: 27rpx;
				min-width: 60rpx;
				padding-top: 8rpx;
				padding-bottom: 8rpx;
				padding-left: 10rpx;
			}
		}
	}

	.discuss-text {
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 10;
		white-space: pre-wrap;
		overflow: hidden;
		margin-bottom: 20rpx;
		margin-top: 20rpx;
	}
	
	.huida {
		margin: 0rpx 10rpx;
		color: $u-tips-color;
	}
	
	.liulanliang {
		margin: 0rpx 10rpx;
		color: $u-tips-color;
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
	
	
	.user-list-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1px solid #f5f5f5;
		background-color: #ffffff;
	
		&:last-child {
			border-bottom: 0;
		}
	
	}
	
	.user-list-item .icon-nv {
		color: #ff4d94;
	}
	
	.user-list-item .icon-nan {
		color: #0091ff;
	}
	
	.user-list-item .avatar {
		margin-right: 20rpx;
	}
	
	.user-list-item .user .name {
		margin-right: 20rpx;
	}
	
	.user-list-item .user .iconfont {
		font-size: 12px;
	}
	
	/* #ifdef H5 */
	.user-list-item .btn-gz {
		margin-right: 20rpx;
	}
	
	/* #endif */
	/* #ifdef MP */
	.user-list-item .btn-gz {
		margin-left: auto;
	}
	
	/* #endif */

	.level{
		height: 27rpx;
		width: 60rpx;
		min-height: 27rpx;
		min-width: 60rpx;
		padding-top: 8rpx;
		padding-bottom: 8rpx;
		// padding-left: 10rpx;
	}

</style>
