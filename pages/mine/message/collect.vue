<template>
	<view>
		<view>
			<!-- 收藏了我消息 -->
			<view class="message">
				<block v-for="(item, index) in collectMessageList" :key="item.id">
					<view class="message-item">
						<view class="messageList-item">
							<view class="center">
								<view style="display: flex;align-items: center;">
									<!-- 用户头像 -->
									<view style="position: relative;">
										<u-avatar class="avatar" :src="item.userInfo.face" size="60"></u-avatar>
										<block v-if="!item.isRead">
											<u-badge :is-dot="true" type="error" :offset="[0,0]"></u-badge>
										</block>
									</view>
									<!-- 用户名 -->
									<text class="username">{{ item.userInfo.nickName.substring(0, 10) }}</text>
									<image class="level" :src="`/static/level/level_${item.level}.png`" ></image>
									
									<!-- 评论时间 -->
									<text class="time">{{item.createTime | TimeFilter(item.createTime)}}</text>
								</view>
								<view style="height: 10rpx"></view>
								<!-- 评论内容 -->
								<text class="content">收藏了你的回答</text>
								<view style="height: 20rpx"></view>
								<!-- 评论的帖子 -->
								<view class="post" @click="jumpToPost(item.post.id,item.id,item.isRead)">
									<view class="post-title">{{item.post.title}}</view>
									<view class="post-content">
										<span class="yueduliang">{{item.post.readCount}} 阅读量</span> ·
										<span class="pinglun">{{item.post.commentCount}} 评论</span> ·
										<span class="liulanliang">{{item.post.collectionCount}} 喜欢</span>
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
		getCollectMessage,
		updateCollectMessagesAsRead
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
				collectMessageList: [],
				loadStatus: "loadmore"
			}
		},
		onShow() {
			this.getCollectMessageList();
		},
		//触底加载
		onReachBottom() {
			this.params.pageNumber++;
			this.loadStatus = "loading";
			this.getCollectMessageList();
		},
		//下拉刷新
		onPullDownRefresh() {
			uni.stopPullDownRefresh();
			this.params.pageNumber = 0;
			this.getCollectMessageList();
		},
		methods: {
			getCollectMessageList() {
				this.loadStatus = "loading";
				getCollectMessage(this.params.pageNumber).then((res) => {
					if (this.params.pageNumber === 1) {
						this.collectMessageList = res.data.result.data;
					} else {
						this.collectMessageList = this.collectMessageList.concat(res.data.result.data);
					}
					console.log("collectMessageList:", this.collectMessageList);
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page === 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}

				})
			},
			// 跳转到帖子详情
			jumpToPost(postId, messageId, isRead) {
				//更新消息为已读
				if (!isRead) {
					updateCollectMessagesAsRead([messageId]).then(() => {});
				}

				uni.navigateTo({
					url: '/pages/BBS/post/post?id=' + postId
				});
			},
			// 全部已读
			allRead() {
				let messageIds = [];
				this.collectMessageList.forEach((item) => {
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
					updateCollectMessagesAsRead(messageIds).then(() => {
						this.getCollectMessageList();
					})
				}
			}
		},
	}
</script>
<style lang="scss" scoped>
	.message-item {
		background: #fff;
		padding: 20rpx;
		margin-bottom: 20rpx;

		.post {
			margin-left: 40rpx;
			background: #f4f4f4;
			border-left: 4rpx solid #999;
			padding-left: 10rpx;
		}
	}

	.messageList-item {
		display: flex;
		align-items: center;

		.center {
			flex: 1;
			display: flex;
			flex-direction: column;
			font-size: 24rpx;
			color: #999;

			.content {
				font-size: 32rpx;
				font-weight: 600;
				color: #000;
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

			.post-content {
				font-size: 20rpx;
			}

			.avatar {
				// position: relative;
			}
		}
	}

	.message-text {
		display: block;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 10;
		white-space: pre-wrap;
		overflow: hidden;
		margin-bottom: 20rpx;
		margin-top: 20rpx;
	}


	.message {
		/* padding-bottom: 100rpx;//防止话题列表最后一个元素被自定义导航栏遮盖 */
	}

	.time {
		margin-left: 20rpx;
	}

	.pinglun {
		margin: 0rpx 5rpx;
		color: $u-tips-color;
	}

	.liulanliang {
		margin: 0rpx 5rpx;
		color: $u-tips-color;
	}

	.yueduliang {
		margin-right: 5rpx;
		color: $u-tips-color;
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