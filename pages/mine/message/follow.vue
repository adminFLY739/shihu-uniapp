<template>
	<view>
		<view>
			<!-- 关注了我消息 -->
			<view class="message">
				<block v-for="(item, index) in followMessageList" :key="item.id">
					<view class="message-item" >
						<view class="messageList-item">
							<view class="center">
								<view class="flex-container">
									<view class="left">
										<!-- 用户头像 -->
										<view style="position: relative;" @click="toUser(item.userInfo.id,item.id,item.isRead)">
											<u-avatar class="avatar" :src="item.userInfo.face" size="60"></u-avatar>
											<block v-if="!item.isRead">
												<u-badge :is-dot="true" type="error" :offset="[0,0]"></u-badge>
											</block>
										</view>
										<!-- 用户名 -->
										<text class="username">{{ item.userInfo.nickName.substring(0, 10) }}</text>
										<image class="level" :src="`/static/level/level_${item.level}.png`" ></image>
										
										<text class="follow-text">关注了你</text>
										<!-- 评论时间 -->
										<text class="time">{{item.createTime | TimeFilter(item.createTime)}}</text>
									</view>
									<view class="right">
										<!-- 回关 -->
										<u-button v-show="!item.isFollow" type="primary" shape="circle" :plain="true" size="mini"
											:hair-line="false" :ripple="true" @click="follow(item.userInfo.id,index)">回关</u-button>
										<u-button v-show="item.isFollow" type="primary" shape="circle" size="mini"
											:hair-line="false" :ripple="true" @click="cancelFollow(item.userInfo.id,index)">已关注</u-button>
										
									</view>
								</view>
								<view style="height: 10rpx"></view>
							</view>
						</view>
					</view>
				</block>
				<!-- 系统状态 -->
				<uni-load-more :status="loadStatus"></uni-load-more>
				<u-toast ref="uToast" />
			</view>

			<!-- 全部已读 -->
			<view @click="allRead" class="allRead">
				<u-icon name="eye-fill" color="#ffffff" size="50"></u-icon>
			</view>


			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	import {
		getFollowMessage,
		updateFollowMessagesAsRead,
		addFollow,
		cancelFollow,
	} from "@/api/bbs.js"
	export default {
		filters: {
			TimeFilter(date) {
				let time = Date.parse(date);
				let oldDate = new Date(time)
				let newDate = new Date()
				var dayNum = "";
				var getTime = (newDate.getTime() - oldDate.getTime()) / 1000;

				if (getTime < 60 * 5) {
					dayNum = "刚刚";
				} else if (getTime >= 60 * 5 && getTime < 60 * 60) {
					dayNum = parseInt(getTime / 60) + "分钟前";
				} else if (getTime >= 3600 && getTime < 3600 * 24) {
					dayNum = parseInt(getTime / 3600) + "小时前";
				} else if (getTime >= 3600 * 24 && getTime < 3600 * 24 * 30) {
					dayNum = parseInt(getTime / 3600 / 24) + "天前";
				} else if (getTime >= 3600 * 24 * 30 && getTime < 3600 * 24 * 30 * 12) {
					dayNum = parseInt(getTime / 3600 / 24 / 30) + "个月前";
				} else if (time >= 3600 * 24 * 30 * 12) {
					dayNum = parseInt(getTime / 3600 / 24 / 30 / 12) + "年前";
				}

				let year = oldDate.getFullYear();
				let month = oldDate.getMonth() + 1;
				let day = oldDate.getDate();
				let hour = oldDate.getHours();
				let minute = oldDate.getMinutes();
				let second = oldDate.getSeconds();
				return dayNum;
			}
		},
		data() {
			return {
				params: {
					pageNumber: 1,
				},
				followMessageList: [],
				loadStatus: "loadmore"
			}
		},
		onShow() {
			this.getFollowMessageList();
		},
		//触底加载
		onReachBottom() {
			this.params.pageNumber++;
			this.loadStatus = "loading";
			this.getFollowMessageList();
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
			this.params.pageNumber = 0;
			this.getFollowMessageList();
		},
		methods: {
			getFollowMessageList() {
				this.loadStatus = "loading";
				getFollowMessage(this.params.pageNumber).then((res) => {
					if (this.params.pageNumber === 1) {
						this.followMessageList = res.data.result.data;
					} else {
						this.followMessageList = this.followMessageList.concat(res.data.result.data);
					}
					console.log("followMessageList:", this.followMessageList);
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page === 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}

				})
			},

			// 全部已读
			allRead() {
				let messageIds = [];
				this.followMessageList.forEach((item) => {
					if (!item.isRead) {
						messageIds.push(item.id);
					}
				});
				console.log("messageIds", messageIds);
				this.$refs.uToast.show({
					title: '全部已读',
					type: 'success',
					icon: "none",
				});
				if (messageIds.length !== 0) {
					updateFollowMessagesAsRead(messageIds).then(() => {
						this.getFollowMessageList();
					})
				}
			},
			// 关注用户
			follow(uid, index) {
				let followForm = {
					id: uid
				}
				addFollow(followForm).then((res) => {
					if (res.data.code === 0) {
						this.followMessageList[index].isFollow = true;
					} 
				});
			
			},
			// 取消关注用户
			cancelFollow(uid, index) {
				let followForm = {
					id: uid
				}
				cancelFollow(followForm).then((res) => {
					if (res.data.code === 0) {
						this.followMessageList[index].isFollow = false;
					}
				});
			},
			
			// 跳转到用户页面
			toUser(uid,messageId,isRead) {
				//更新消息为已读
				if (!isRead) {
					updateFollowMessagesAsRead([messageId]).then(() => {});
				}
				uni.navigateTo({
					url: '/pages/BBS/user/home?uid=' + uid
				});
			},
		},
	}
</script>
<style lang="scss" scoped>
	.message-item {
		background: #fff;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.messageList-item {
			display: flex;
			align-items: center;

			.center {
				flex: 1;
				font-size: 24rpx;
				color: #999;
			}

			.flex-container {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.left {
					display: flex;
					align-items: center;

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
			
					.follow-text {
						color: #000;
						margin-left: 15rpx;
					}

					.time {
						margin-left: 20rpx;
					}
				}

				.right {
					display: flex;
				}
			}
		}
	}

	.allRead {
		position: fixed;
		right: 20rpx;
		bottom: 180rpx;
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background-color: #333333;
		box-shadow: 0 0 20rpx #999;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>