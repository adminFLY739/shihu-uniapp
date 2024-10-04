<template>
	<div class="wrapper">

		<div style="height: 250rpx">
			<view class="content">
				<!-- 楼层装修组件 -->
				<tpl ref="tpl" :allMessageUnReadCount="allMessageUnReadCount" />
				<u-tabs :list="tabs" :active-color="mainColor" :is-scroll="false" :current="current"
					@change="change"></u-tabs>
			</view>
		</div>

		<!-- 想法 -->
		<view class="wrap" v-if="current === 0">
			<u-waterfall v-model="flowList" ref="uWaterfall" :add-time="50">
				<!-- 左列表 -->
				<template v-slot:left="{leftList}">
					<view class="demo-warter" v-for="(item, index) in leftList" :key="item.id"
						@click="jumpToPostDetail(item)">
						<view class="demo-img-wrap">
							<image class="demo-image" :src="item.media[0]" mode="widthFix"></image>
						</view>
						<view class="demo-title">
							{{item.title}}
						</view>
						<view class="demo-tag">
							<u-avatar :src="item.userInfo.face" mode="circle" size=50></u-avatar>
							<view class="demo-tag-text">
								{{item.userInfo.nickName}}
							</view>
							<image class="level" :src="`/static/level/level_${item.level}.png`"></image>
							
							<!-- 红爱心 -->
							<view v-show="item.isCollection" class="p-item"
								@click.stop="cancelCollection(item.id,item.collectionCount,item.uid)" :key="index">
								<u-icon name="heart-fill" color="#cc0000"></u-icon>
								<text class="count">{{ item.collectionCount }}</text>
							</view>
							<!-- 白爱心 -->
							<view v-show="!item.isCollection" class="p-item"
								@click.stop="addCollection(item.id,item.collectionCount,item.uid)" :key="index">
								<u-icon name="heart"></u-icon>
								<text class="count">{{ item.collectionCount }}</text>
							</view>
						</view>
						<!-- 回答标签 -->
						<span class="demo-shop1" v-for="(cut, index) in item.cutName">
							{{cut}}
						</span>
					</view>
				</template>

				<!-- 右列表 -->
				<template v-slot:right="{rightList}">
					<view class="demo-warter" v-for="(item, index) in rightList" :key="item.id"
						@click="jumpToPostDetail(item)">
						<view class="demo-img-wrap">
							<image class="demo-image" :src="item.media[0]" mode="widthFix"></image>
						</view>
						<view class="demo-title">
							{{item.title}}
						</view>
						<view class="demo-tag">
							<u-avatar :src="item.userInfo.face" mode="circle" size=50></u-avatar>

							<view class="demo-tag-text">
								{{item.userInfo.nickName}}
							</view>
							<image class="level" :src="`/static/level/level_${item.level}.png`"></image>

							<!-- 红爱心 -->
							<view v-show="item.isCollection" class="p-item"
								@click.stop="cancelCollection(item.id,item.collectionCount,item.uid)" :key="index">
								<u-icon name="heart-fill" color="#cc0000"></u-icon>
								<text class="count">{{ item.collectionCount }}</text>
							</view>

							<!-- 白爱心 -->
							<view v-show="!item.isCollection" class="p-item"
								@click.stop="addCollection(item.id,item.collectionCount,item.uid)" :key="index">
								<u-icon name="heart"></u-icon>
								<text class="count">{{ item.collectionCount }}</text>
							</view>
						</view>

						<!-- 回答标签 -->
						<span class="demo-shop1" v-for="(cut, index) in item.cutName">
							{{cut}}
						</span>

					</view>
				</template>
			</u-waterfall>
			<!-- 系统状态 -->
			<uni-load-more :status="loadStatus"></uni-load-more>
			<u-toast ref="uToast" />
		</view>

		<!-- 话题 -->
		<view v-if="current === 1" class="discuss">
			<block v-for="(item, index) in discussList" :key="item.id">
				<view @click="jumpToDiscuss(item)">
					<view class="discuss-item">
						<view class="discussList-item">
							<view class="center">
								<view style="display: flex;align-items: center;">
									<!-- 用户头像 -->
									<u-avatar class="avatar" :src="item.userInfo.face" size="60"></u-avatar>
									<!-- 用户名 -->
									<text class="username">{{ item.userInfo.nickName.substring(0, 10) }}</text>
									<image class="level" :src="`/static/level/level_${item.level}.png`"></image>
								</view>
								<view style="height: 10rpx"></view>
								<!-- 话题标题 -->
								<text class="title">{{item.title}}</text>

								<view style="height: 20rpx"></view>
								<view>
									{{item.followCount}} <span class="followCount">关注</span> ·
									{{item.postCount}} <span class="huida">回答</span> ·
									{{item.readCount}} <span class="liulanliang">浏览量</span>
								</view>
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 系统状态 -->
			<uni-load-more :status="loadStatus"></uni-load-more>
			<u-toast ref="uToast" />
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
		<u-modal v-model="addShow" confirm-text="发布帖子" cancel-text="发布话题" :mask-close-able="true" content="请选择你要发布的类型"
			:show-cancel-button="true" :show-title="false" @confirm="toAddPost" @cancel="toAddDiscuss">
		</u-modal>



	</div>
</template>
<script>
	import tpl from "@/pages/tabbar/home/views.vue";
	import {
		lastPost,
		addCollection,
		cancelCollection,
		lastDiscuss,
		getAllMessageNoReadCount
	} from "@/api/bbs";
	import Vue from "vue";

	export default {
		data() {
			return {
				allMessageUnReadCount: 0,
				addShow: false, //midbuttom弹出框
				current: 0, //tabs索引
				background: {
					backgroundColor: "#fff",
				},
				keyword: '',
				pageNumber1: 1,
				pageNumber2: 1,
				mainColor: this.$mainColor, //主色调
				tabs: [{
						name: "想法",
					},
					{
						name: "话题",
					},
				], // 标签
				loadStatus: 'loadmore', //加载更多状态
				flowList: [], //瀑布流数据
				classId: 0, //帖子分类，0为所有分类
				discussList: [],

				//tabbar数据
				show_index: 0, //控制切换tabbar页面
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
		onShow() {
			this.loadData();
			this.allMessageNoReadCount();
		},
		methods: {
			//切换tabs
			change(index) {
				this.current = index;
			},
			// 下拉刷新被触发
			refresherrefreshFun() {
				this.pageNumber1 = 1;
				this.pageNumber2 = 1;
				this.loadData();
			},
			//获取数据
			async loadData() {
				this.getLastPost();
				this.getLastDiscuss();
			},

			// 加载新分页
			loadmore() {
				if (this.current === 0) {
					this.pageNumber1++;
					this.getLastPost();
				} else {
					this.pageNumber2++;
					this.getLastDiscuss();
				}
			},

			// 获取消息未读数
			allMessageNoReadCount() {
				getAllMessageNoReadCount().then((res) => {
					this.allMessageUnReadCount = res.data.result;
				});
			},
			
			// 名字过长省略
			omitName(name){
				let value = name;
				if (name.length > 10) {
				  value = name.substring(0, 10) + "...";
				}
				return value;
			},

			//获取最新帖子
			async getLastPost() {
				this.loadStatus = 'loading';
				let list = [];
				await lastPost(this.pageNumber1, this.classId).then((res) => {
					list = res.data.result.data;
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page ===
						0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}
				});

				//如果获取的是第一页的数据直接覆盖原数据，否则将新数据添加在原数据后边(无图片的帖子将过滤掉)
				if (this.pageNumber1 === 1) {
					this.flowList = list.filter(item => item.media.length !== 0);
				} else {
					this.flowList = this.flowList.concat(list.filter(item => item.media.length !== 0))
				}
				uni.hideLoading();
			},

			// 踩了个坑：此处的index是左右列表单独计算的index,不是flowList的index，this.flowList[index]的用法是错误的，得不到点击的对象
			// 取消收藏
			cancelCollection(id, collectionCount, uid) {
				let cancelForm = {
					id: id
				}
				cancelCollection(cancelForm).then((res) => {
					if (res.data.code === 0) {
						this.$refs.uWaterfall.modify(id, "isCollection", false);
						this.$refs.uWaterfall.modify(id, "collectionCount", collectionCount - 1);
						this.$refs.uToast.show({
							title: '取消点赞',
							type: 'warning',
							duration: 1000,
							position: 'top ',
						});
					}
				});
			},
			// 添加收藏（点赞）
			addCollection(id, collectionCount, uid) {
				let addColForm = {
					id: id,
					uid: uid
				}
				addCollection(addColForm).then((res) => {
					if (res.data.code === 0) {
						this.$refs.uWaterfall.modify(id, "isCollection", true);
						this.$refs.uWaterfall.modify(id, "collectionCount", collectionCount + 1);
						this.$refs.uToast.show({
							title: '已点赞',
							type: 'success',
							duration: 1000,
							position: 'top ',
						});
					}
				});
			},
			// 进入帖子详情
			jumpToPostDetail(item) {
				let url;
				// 图文
				if (item.type == 1 || item.type == 4) {
					url = '/pages/BBS/post/post?id=' + item.id;
				}
				uni.navigateTo({
					url: url
				});
			},

			// 移除瀑布流数据
			remove(id) {
				this.$refs.uWaterfall.remove(id);
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

			//获取最新话题列表
			async getLastDiscuss() {
				this.loadStatus = 'loading';
				await lastDiscuss(this.pageNumber2).then((res) => {
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page ===
						0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}

					//第一页的数据直接覆盖原数据，否则将新数据添加在原数据后边
					if (this.pageNumber2 === 1) {
						this.discussList = res.data.result.data;
					} else {
						this.discussList = this.discussList.concat(res.data.result.data);
					}
					console.log("discussList", this.discussList);
				});
			},

			// 跳转到话题详情
			jumpToDiscuss(item) {
				console.log("item", item);
				uni.navigateTo({
					url: '/pages/BBS/discuss/discuss?id=' + item.id + "&uid=" + item.uid
				});
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


		},
		onLoad() {
			// 初次进入应用时加载首页
			console.log("首页帖子加载完成");
			// #ifdef MP-WEIXIN
			// 小程序默认分享
			uni.showShareMenu({
				withShareTicket: true,
				menus: ["shareAppMessage", "shareTimeline"],
			});
			// #endif
		},
		//触底加载
		onReachBottom() {
			// 给子级监听触底加载
			uni.$emit('onReachBottom', true)
			this.loadmore();
		},

		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
			this.refresherrefreshFun();
		},
		components: {
			tpl
		},
	};
</script>

<style lang="scss" scoped>
	.content {
		position: fixed;
		top: 0rpx;
		left: 0;
		background: #fff;
		width: 100%;
		z-index: 99;
	}
	
	.level{
		height: 27rpx;
		width: 60rpx;
		min-height: 27rpx;
		min-width: 60rpx;
		padding-top: 18rpx;
		padding-bottom: 8rpx;
		padding-left: 10rpx;
	}

	.demo-warter {
		border-radius: 8px;
		margin: 5px;
		background-color: #ffffff;
		padding: 8px;
		position: relative;
	}

	.demo-image {
		width: 100%;
		border-radius: 4px;
	}

	.demo-title {
		font-size: 30rpx;
		margin-top: 5px;
		color: $u-main-color;
	}

	.demo-tag {
		display: flex;
		margin-top: 5px;
	}

	.demo-tag-owner {
		background-color: $u-type-error;
		color: #FFFFFF;
		display: flex;
		align-items: center;
		padding: 4rpx 14rpx;
		border-radius: 50rpx;
		font-size: 20rpx;
		line-height: 1;
	}

	.demo-tag-text {
		margin-left: 5px;
		line-height: 1;
		padding: 4rpx 5rpx;
		display: flex;
		align-items: center;
		border-radius: 50rpx;
		font-size: 20rpx;
		// width: 100rpx;
		// white-space: nowrap;
		// overflow: hidden;
		// text-overflow: ellipsis;
	}

	.demo-shop {
		border: 1px solid black;
		font-size: 22rpx;
		color: $u-tips-color;
		margin-top: 5px;
	}

	.demo-shop1 {
		border: 1px solid $u-tips-color;
		font-size: 22rpx;
		color: $u-tips-color;
		margin-top: 5px;
		border-radius: 10rpx;
		padding: 4rpx 5rpx;
		margin-right: 5rpx;
		margin-top: 2rpx;
	}

	.p-item {
		margin-left: auto;
		// margin: 0 auto;
		color: #616161;
		display: flex;
		align-items: center;

		.count {
			margin-left: 10rpx;
			font-size: 28rpx;
		}
	}

	.p-item[hidden] {
		display: none !important;
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

			.username {
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

	.followCount {
		margin: 0rpx 10rpx;
		color: $u-tips-color;
	}

	.huida {
		margin: 0rpx 10rpx;
		color: $u-tips-color;
	}

	.liulanliang {
		margin: 0rpx 10rpx;
		color: $u-tips-color;
	}

	.discuss {
		padding-bottom: 100rpx; //防止话题列表最后一个元素被自定义导航栏遮盖
	}
	
	
</style>