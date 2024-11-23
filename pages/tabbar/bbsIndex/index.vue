<template>
	<view>
		<!-- 关注|最新 导航栏 -->
		<u-navbar :is-back="false" z-index="99999">
			<u-tabs :list="tabList" font-size="35" name="cateName" bg-color="#fff" :current="current" @change="tabChange"></u-tabs>
			<view slot="right" class="navbar-right">
				<view class="talk-time">
					<u-badge type="error" is-center absolute :count="allMessageUnReadCount" ></u-badge>
				</view>
				<u-icon name="bell" @click="linkMsgDetail" color="#666" size="50"></u-icon>
			</view> 
		</u-navbar>
		
		<!-- 标签 -->
		<view class="tabs-wrap" v-if="current === 1">
			<u-tabs :list="classList" name="cateName" :current="currentCate" @change="tabChangeCate"></u-tabs>
		</view>
		
		<!-- 最新 页面 -->
		<view v-if="current === 1">
			<post-list :list="lastPost" :loadStatus="loadStatus2" @delPost="delPost" :userInfo="userInfo"></post-list>
		</view>
		
		<!-- 关注 页面 -->
		<view v-if="current === 0">
			<post-list :list="followUserPost" :loadStatus="loadStatus1"></post-list>
		</view>
		
		<!-- 发贴入口（🖊按钮） -->
		<add-post-tag></add-post-tag>
		
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
	import postList from '@/components/post-list/post-list.vue';
	import addPostTag from '@/components/add-post-tag/add-post-tag.vue';
	import {
		lastPost,
		followUserPost,
		classList,
		getAllMessageNoReadCount
	} from "@/api/bbs";
	import storage from "@/utils/storage.js";
	export default {
		components: {
			postList,
			addPostTag,
		},
		data() {
			return {
				allMessageUnReadCount: 0,
				addShow: false, //midbuttom弹出框
				loadStatus1: 'loadmore',
				loadStatus2: 'loadmore',
				page1: 1,
				page2: 1,
				storage,
				userInfo: storage.getUserInfo(),
				classId: 0,
				classList: [{
					cateId: 0,
					cateName: '推荐'
				}],
				shareCover: '', //分享封面
				followUserPost: [],
				lastPost: [],
				tabList: [{
						name: '关注'
					},
					{
						name: '最新'
					}
				],
				current: 1,
				currentCate: 0,
				
				//tabbar数据
				show_index: 3, //控制切换tabbar页面
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
		onShareAppMessage(res) {
			return {
				title: this.$c.miniappName,
				path: '/pages/tabbar/bbsIndex/index',
				imageUrl: this.shareCover
			};
		},
		onShow() {
			this.userInfo = storage.getUserInfo()
			//解决发布帖子返回后页面不更新的问题
			// this.getLastPost();
      if (this.current === 0) {
        this.page1 = 1;
        this.followUserPost = [];
        this.getFollowUserPost();
      }
      if (this.current === 1) {
        this.page2 = 1;
        this.lastPost = [];
        this.getLastPost();
      }
			this.allMessageNoReadCount();
		},
		onLoad() {
			this.getLastPost();
			this.getClassList();
		},

		//触底加载
		onReachBottom() {
			if (this.current === 0) {
				this.page1++;
				this.getFollowUserPost();
			}

			if (this.current === 1) {
				this.page2++;
				this.getLastPost();
			}
		},
		
		// 下拉刷新
		onPullDownRefresh() {
			if (this.current === 0) {
				this.page1 = 1;
				this.followUserPost = [];
				this.getFollowUserPost();
			}
			if (this.current === 1) {
				this.page2 = 1;
				this.lastPost = [];
				this.getLastPost();
			}
			uni.stopPullDownRefresh();
      console.log("111");
		},
		methods: {

			tabChange(index) {
				this.current = index;
				this.followUserPost = [];
				this.lastPost = [];

				if (index === 0) {
					this.page1 = 1;
					this.getFollowUserPost();

				}
				if (index === 1) {
					this.page2 = 1;
					this.getLastPost();
				}
			},
			getSysInfo() {
				this.$H.get('system/miniConfig').then(res => {
					this.shareCover = res.result.intro;
				});
			},
			// 获取关注用户帖子
			getFollowUserPost() {
				this.loadStatus1 = 'loading';
				followUserPost(this.page1).then((res) => {
					if (res.data.code === 0 && res.data.result) {
						this.followUserPost = this.followUserPost.concat(res.data.result.data);
						if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page ===
							0) {
							this.loadStatus1 = 'nomore';
						} else {
							this.loadStatus1 = 'loadmore';
						}
					} else {
						this.loadStatus1 = 'nomore';
					}

				});
			},
			delPost() {
				this.page2 = 1;
				this.lastPost = [];
				this.getLastPost();
			},
			getClassList() {
				classList().then((res) => {
					this.classList = this.classList.concat(res.data.result)
				});
			},

			tabChangeCate(index) {
				this.currentCate = index
				this.page2 = 1
				this.classId = this.classList[index].cateId
				this.lastPost = []
				this.getLastPost();
			},
			//获取最新帖子
			getLastPost() {
				this.loadStatus2 = 'loading';
				lastPost(this.page2, this.classId).then((res) => {
					this.lastPost = this.lastPost.concat(res.data.result.data);
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page === 0) {
						this.loadStatus2 = 'nomore';
					} else {
						this.loadStatus2 = 'loadmore';
					}
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
		}
	};
</script>

<style lang="scss">
	page {
		background-color: #F5F5F5;
	}
	
	.navbar-right {
		padding: 0 16rpx 0 0;
	}
	
	.talk-time {
		position: relative;
	}
	
	.content {
		position: fixed;
		top: 0rpx;
		left: 0;
		background: #fff;
		width: 100%;
		z-index: 9999;
	}
	
	/* tabbar */
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