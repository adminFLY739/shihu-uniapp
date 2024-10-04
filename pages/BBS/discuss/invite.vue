<template>
	<view>
		<u-tabs :list="tabList" font-size="35" bg-color="#fff" :current="current" @change="change" :is-scroll="false"></u-tabs>
		
		<!-- 推荐 -->
		<view class="wrap" v-if="current === 0">
			<block v-for="(item, index) in userRecommendList" :key="item.id">
				<view>
					<view class="invite-item">
						<view class="inviteList-item">
							<view class="center">
								<view class="flex-container">
									<view class="left">
										<!-- 用户头像 -->
										<u-avatar class="avatar" :src="item.avatar" size="80"></u-avatar>
										<!-- 用户名 -->
										<text class="username">{{ item.nickName.substring(0, 10) }}</text>
										<image class="level" :src="`/static/level/level_${item.level}.png`" ></image>
									</view>
									<view class="right">
										<!-- 邀请 -->
										<block v-if="!item.isInvite">
											<u-button type="primary" shape="circle" :plain="true" size="mini"
												:hair-line="false" :ripple="true" @click="invite(item.id,index)">邀请回答</u-button>
										</block>
										<block v-else>
											<u-button type="info" shape="circle" :plain="true" size="mini"
												:hair-line="false" :ripple="true">已邀请</u-button>
										</block>
										
									</view>
								</view>
								<view style="height: 10rpx"></view>
							</view>
						</view>
					</view>
				</view>
			</block>


			<!-- 加载状态 -->
			<block v-if="userRecommendList.length === 0 && loadStatus1 == 'nomore'">
				<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
			</block>
			<block v-else>
				<view style="margin: 30rpx 0;">
					<u-loadmore :status="loadStatus1" />
				</view>
			</block>
		</view>

		<!-- 好友 -->
		<view v-if="current === 1">
			<block v-for="(item, index) in userFriendList" :key="item.id">
				<view >
					<view class="invite-item">
						<view class="inviteList-item">
							<view class="center">
								<view style="display: flex;align-items: center;">
									<!-- 用户头像 -->
									<u-avatar class="avatar" :src="item.userInfo.face" size="60"></u-avatar>
									<!-- 用户名 -->
									<text class="username">{{ item.userInfo.nickName.substring(0, 10) }}</text>
								</view>
								<view style="height: 10rpx"></view>
								
							</view>
						</view>
					</view>
				</view>
			</block>
			<!-- 系统状态 -->
			<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
			<u-toast ref="uToast" />
		</view>

		<!-- 邀请提示 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getUserRecommendList,
		getUserFriendList,
		inviteReply
	} from "@/api/bbs";
	import storage from "@/utils/storage.js";

	export default {
		data() {
			return {
				current: 0, //tabs索引
				userRecommendList: [],
				userFriendList: [],
				pageNumber1: 1,
				pageNumber2: 1,
				loadStatus1: 'loadmore',
				loadStatus2: 'loadmore',
				tabList: [{
					name: '推荐'
				}, {
					name: '好友'
				}],
				tenantId: storage.getMainTenant().tenantId,
				discussId: 0,
			};
		},
		methods: {
			//切换tabs
			change(index) {
				this.current = index;
			},
			
			invite(uid,index){
				let inviteForm = {
					discussId: this.discussId,
					uid: uid
				};
				inviteReply(inviteForm).then((res)=>{
					this.userRecommendList[index].isInvite = true;
					this.$refs.uToast.show({
						title: '邀请成功',
						type: 'success',
						duration: 1000,
						position: 'top '
					});
				});
			},

			//加载新分页数据
			loadmore() {
				if (this.current === 0) {
					this.pageNumber1++;
					this.getUserRecommendList();
				} else {
					this.pageNumber2++;
					// this.getUserFriendList();
				}
			},

			//获取推荐和好友的用户数据
			loadData() {
				this.getUserRecommendList();
				// this.getUserFriendList();
			},

			//获取推荐用户数据
			getUserRecommendList() {
				this.loadStatus1 = 'loading';
				let userRecommendListForm = {
					currPage: this.pageNumber1,
					tenantId: this.tenantId,
					discussId: this.discussId
				};
				getUserRecommendList(userRecommendListForm).then((res) => {
					// 更新加载状态
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page === 0) {
						this.loadStatus1 = 'nomore';
					} else {
						this.loadStatus1 = 'loadmore';
					}
					//第一页的数据直接覆盖原数据，否则将新数据添加在原数据后边
					if (this.pageNumber1 === 1) {
						this.userRecommendList = res.data.result.data;
					} else {
						this.userRecommendList = this.userRecommendList.concat(res.data.result.data);
					}
					console.log("userRecommendList", this.userRecommendList);
				});
			},

			//获取好友用户数据
			getUserFriendList() {
				this.loadStatus2 = 'loading';
				getUserFriendList(this.pageNumber2,this.tenantId).then((res) => {
					// 更新加载状态
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page === 0) {
						this.loadStatus2 = 'nomore';
					} else {
						this.loadStatus2 = 'loadmore';
					}
					
					if (this.pageNumber2 === 1) {
						this.userFriendList = res.data.result.data;
					} else {
						this.userFriendList = this.userFriendList.concat(res.data.result.data);
					}
					console.log("userFriendList", this.userFriendList);
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
		},
		onLoad(query) {
			this.discussId = query.discussId;
		}

		// 下拉刷新
		// onPullDownRefresh() {
		// 	uni.stopPullDownRefresh();
		// 	this.pageNumber1 = 1;
		// 	this.pageNumber2 = 1;
		// 	this.userRecommendList = [];
		// 	this.userFriendList = [];
		// 	this.loadData();
		// },

	}
</script>

<style lang="scss">
	.invite-item {
		background: #fff;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.inviteList-item {
			display: flex;
			align-items: center;
		
			.center {
				flex: 1;
				display: flex;
				flex-direction: column;
				font-size: 24rpx;
				color: #999;
		
				.flex-container {
					display: flex;
					justify-content: space-between;
					align-items: center;
				
					.left {
						display: flex;
						align-items: center;
				
						.username {
							font-size: 32rpx;
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
				
					.right {
						display: flex;
					}
				}
			}
			
		}
	}
</style>