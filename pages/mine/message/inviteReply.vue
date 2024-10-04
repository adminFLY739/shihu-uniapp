<template>
	<view>
		<u-tabs :list="tabList" font-size="35" bg-color="#fff" :current="current" @change="change"></u-tabs>

		<!-- 邀请 -->
		<view class="wrap" v-if="current === 0">
			<block v-for="(item, index) in inviteMessageList" :key="item.id">
				<view>
					<view class="message-item">
						<view class="messageList-item">
							<view class="center">
								<view class="flex-container">
									<view class="left">
										<!-- 用户头像 -->
										<u-avatar class="avatar" :src="item.userInfo.face" size="75"></u-avatar>
										<view>
											<!-- 用户名 -->
											<text class="username">{{ item.userInfo.nickName.substring(0, 10) }}</text>
											<image class="level" :src="`/static/level/level_${item.level}.png`" ></image>
											
											<view class="invit-time">
												<view>
													<text class="">邀请你回答 · </text>
												</view>
												<view>
													<!-- 邀请时间 -->
													<text
														class="time">{{item.createTime | TimeFilter(item.createTime)}}</text>
												</view>
											</view>
										</view>
									</view>
									<view class="right">
										<u-icon name="close"></u-icon>
									</view>
								</view>

								<view style="height: 10rpx"></view>

								<!-- 邀请话题 -->
								<view class="inviteDiscuss" @click.stop="jumpToDiscuss(item.discuss)">
									<!-- 话题标题 -->
									<text class="title">{{item.discuss.title}}</text>

									<view class="content">
										<view class="left">
											{{item.discuss.readCount}} <span class="liulanliang">浏览量</span> ·
											{{item.discuss.postCount}} <span class="huida">回答</span> ·
											{{item.discuss.followCount}} <span class="followCount">关注</span>
										</view>

										<view class="right">
											<u-button type="primary" shape="circle" size="mini" :hair-line="false"
												:ripple="true" @click.stop="reply(item.discuss.id,item.discuss.title)">写回答</u-button>
										</view>
									</view>
								</view>

							</view>
						</view>
					</view>
				</view>
			</block>


			<!-- 加载状态 -->
			<block v-if="inviteMessageList.length === 0 && loadStatus1 == 'nomore'">
				<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
			</block>
			<block v-else>
				<view style="margin: 30rpx 0;">
					<u-loadmore :status="loadStatus1" />
				</view>
			</block>

			<!-- 全部已读 -->
			<view @click="allRead" class="allRead">
				<u-icon name="eye-fill" color="#ffffff" size="50"></u-icon>
			</view>
		</view>
		
		<!-- 推荐 -->
		<view class="wrap" v-if="current === 1">
			<!-- 加载状态 -->
			<!-- <block v-if="recommendMessageList.length === 0 && loadStatus2 == 'nomore'"> -->
				<u-empty margin-top="100" text="暂无内容" mode="favor"></u-empty>
			<!-- </block> -->
	<!-- 		<block v-else>
				<view style="margin: 30rpx 0;">
					<u-loadmore :status="loadStatus2" />
				</view>
			</block> -->
		</view>
		
		<!-- 已读提示 -->
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		getInviteMessageList,
		updateInviteMessagesAsRead
	} from "@/api/bbs";

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
				current: 0, //tabs索引
				tabList: [{
					name: '邀请'
				}, {
					name: '推荐'
				}],
				pageNumber1: 1,
				pageNumber2: 1,
				loadStatus1: 'loadmore',
				loadStatus2: 'loadmore',
				inviteMessageList: [],
				recommendMessageList: []
			};
		},
		onShow() {
			this.inviteMessagesList();
		},
		//触底加载
		onReachBottom() {
			// 给子级监听触底加载
			uni.$emit('onReachBottom', true)
			this.loadmore();
		},
		methods: {
			//切换tabs
			change(index) {
				this.current = index;
			},
			
			//加载新分页数据
			loadmore() {
				if (this.current === 0) {
					this.pageNumber1++;
					this.inviteMessagesList();
				} else {
					this.pageNumber2++;
					// this.getUserFriendList();
				}
			},

			//获取邀请回答消息列表
			inviteMessagesList() {
				this.loadStatus1 = 'loading';
				getInviteMessageList(this.pageNumber1).then((res) => {
					// 更新加载状态
					if (res.data.result.current_page >= res.data.result.total || res.data.result.last_page === 0) {
						this.loadStatus1 = 'nomore';
					} else {
						this.loadStatus1 = 'loadmore';
					}
					//第一页的数据直接覆盖原数据，否则将新数据添加在原数据后边
					if (this.pageNumber1 === 1) {
						this.inviteMessageList = res.data.result.data;
					} else {
						this.inviteMessageList = this.inviteMessageList.concat(res.data.result.data);
					}
					console.log("inviteMessageList", this.inviteMessageList);
				});
			},

			// 全部已读
			allRead() {
				let messageIds = [];
				this.inviteMessageList.forEach((item) => {
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
					updateInviteMessagesAsRead(messageIds).then(() => {
						this.getInviteMessageList();
					})
				}
			},

			// 写回答
			reply(discussId, title) {
				uni.navigateTo({
					url: '/pages/BBS/discuss/reply?discussId=' + discussId + '&title=' + title
				});
			},

			// 跳转到话题
			jumpToDiscuss(item) {
				uni.navigateTo({
					url: '/pages/BBS/discuss/discuss?id=' + item.id + "&uid=" + item.uid
				});
			}

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

				.flex-container {
					display: flex;
					justify-content: space-between;
					align-items: center;

					.left {
						display: flex;
						align-items: center;

						.username {
							font-size: 28rpx;
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

						.invit-time {
							display: flex;
							margin-left: 10rpx;
							font-size: 22rpx;
							justify-content: space-between;

							.time {
								margin-left: 20rpx;
							}
						}


					}

					.right {
						display: flex;
					}
				}

				.inviteDiscuss {
					background-color: #f4f4f4;
					padding: 10rpx;
					border-radius: 8rpx;


					.title {
						font-size: 32rpx;
						font-weight: 600;
						color: #000;
						padding-top: 20rpx;
					}

					.content {
						display: flex;
						justify-content: space-between;
						align-items: center;
						margin-top: 20rpx;
						padding-bottom: 10rpx;

						.left {
							display: flex;
							align-items: center;

							.followCount {
								margin: 0rpx 15rpx;
								color: $u-tips-color;
							}

							.huida {
								margin: 0rpx 15rpx;
								color: $u-tips-color;
							}

							.liulanliang {
								margin: 0rpx 15rpx;
								color: $u-tips-color;
							}
						}

						.right {
							display: flex;
							padding-right: 20rpx;
						}


					}


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