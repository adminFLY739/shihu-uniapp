<template>
	<view class="content">
		<scroll-view class="list-scroll-content" scroll-y @scrolltolower="loadData(tabIndex)">

			<!-- 消息列表 -->
			<div class="iconBox">
				<view class="icon-list">

					<view class="icon-item" @click="navigateTo('/pages/mine/message/comment')">
						<div class="bag">
							<u-icon name="more-circle" size="50" color="#000000"></u-icon>
							<u-badge type="error" :offset="[-8,-8]" :count="commentMessageNoReadCount"></u-badge>
						</div>
						<view class="icon-text">评论转发</view>
					</view>

					<view class="icon-item" @click="navigateTo('/pages/mine/message/endorse')">
						<div class="bag">
							<u-icon name="heart" size="50" color="#000000"></u-icon>
							<u-badge type="error" :offset="[-8,-8]" :count="endorseMessageNoReadCount"></u-badge>
						</div>
						<view class="icon-text">赞同喜欢</view>
					</view>

					<view class="icon-item" @click="navigateTo('/pages/mine/message/collect')">
						<div class="bag">
							<u-icon name="star" size="50" color="#000000"></u-icon>
							<u-badge type="error" :offset="[-8,-8]" :count="collectMessageNoReadCount"></u-badge>
						</div>
						<view class="icon-text">收藏了我</view>
					</view>

					<view class="icon-item" @click="navigateTo('/pages/mine/message/follow')">
						<div class="bag">
							<u-icon name="eye" size="50" color="#000000"></u-icon>
							<u-badge type="error" :offset="[-8,-8]" :count="followMessageNoReadCount"></u-badge>
						</div>
						<view class="icon-text">新增关注</view>
					</view>


				</view>
			</div>



			<!-- 邀请回答 -->
			<view class="invitation" @click="navigateTo('/pages/mine/message/inviteReply')">
				<u-avatar :src="invitationIconSrc" class="avatar"></u-avatar>
				<view class="content">
					<view class="left">
						<view class="text1">邀请回答</view>
						<block v-if="inviteMessageNoReadCount > 0">
							<view class="text2">点击查收新增邀请回答</view>
						</block>
						<block v-else>
							<view class="text2">推荐问题邀你回答</view>
						</block>
						
					</view>
					<view class="right">
						<u-badge  type="error" :absolute="false" :count="inviteMessageNoReadCount" size="default"></u-badge>
					</view>
				</view>
			</view>


			<u-gap height="20" bg-color="#F5F5F5"></u-gap>



		</scroll-view>
	</view>
</template>

<script>
	import {
		getMessageNoReadCount
	} from "@/api/bbs.js";
	import storage from "@/utils/storage.js";
	import {
		beautifyTime
	} from "@/utils/filters.js"
	export default {
		data() {
			return {
				storage,
				count: {
					loadStatus: "more",
				},
				userName: '',
				invitationIconSrc: '../../../static/mine/invite.png',
				commentMessageNoReadCount: 0,
				endorseMessageNoReadCount: 0,
				collectMessageNoReadCount: 0,
				followMessageNoReadCount: 0,
				inviteMessageNoReadCount: 0,
			};
		},

		onShow() {
			this.messageNoReadCount();
		},
		// 下拉刷新
		onPullDownRefresh() {},
		// 触底加载
		onReachBottom() {},
		methods: {
			beautifyTime,
			
			navigateTo(url) {
				uni.navigateTo({
					url,
				});
			},
			
			messageNoReadCount() {
				getMessageNoReadCount().then((res) => {
					console.log("messageNoReadCount:",res);
					this.commentMessageNoReadCount = res.data.result.commentMessageNoReadCount;
					this.endorseMessageNoReadCount = res.data.result.endorseMessageNoReadCount;
					this.collectMessageNoReadCount = res.data.result.collectMessageNoReadCount;
					this.followMessageNoReadCount = res.data.result.followMessageNoReadCount;
					this.inviteMessageNoReadCount = res.data.result.inviteMessageNoReadCount;
				});
			},

		},
	};
</script>

<style lang="scss" scoped>
	.iconBox {
		background: #fff;
		border-radius: 20rpx;
	}

	.icon-list {
		height: 140rpx;
		text-align: center;
		font-size: $font-sm;
		display: flex;
		justify-content: space-around;
		align-items: center;
		color: #999;

		.icon-item {
			position: relative;
			line-height: 2em;
			width: 96rpx;

			:first-child {
				font-size: 48rpx;
				margin-bottom: 10rpx;
			}
			
			.icon-text{
				color: #000;
			}
		}
	}

	.bag {
		width: 56rpx;
		height: 56rpx;
		border-radius: 50%;
		margin: 0 auto;
		position: relative;
	}


	.invitation {
		display: flex;
		background-color: #fff;
		padding: 18rpx 0;
		
		.avatar {
			margin: 10rpx 10rpx;
		}
		
		.content {
			display: flex;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			
			.left{
				display: flex;
				flex-direction: column;
				
				.text1{
					margin-top: 10rpx;
					font-size: 30rpx;
					color: #000;
				}
				.text2{
					font-size: 26rpx;
					color: #999;
				}
			}
			
			.right{
				display: flex;
				margin-right: 20rpx;
			}
			
		}
	}
</style>